// @flow

import fs from 'fs';
import mkdirp from 'mkdirp';
import { resolve, basename, dirname, extname } from 'path';
import { EOL } from 'os';
import isBinaryFile from 'isbinaryfile';
import battleCasex from 'battle-casex';
const homedir = require('os').homedir();

import { logger } from '../helpers';

import glob from './glob';

import Line from './Line';
import LineCollection, { type LineCollectionType } from './LineCollection';

const LINE_BREAK = /\r?\n/;

export default class File {
  static EOL = EOL;

  path: string;
  _lines: LineCollectionType;

  constructor(path: string, name?: string) {
    this.path = battleCasex(path, name);
  }

  existing(path: string, name?: string): File {
    if (path.endsWith('/')) path += this.filename;

    const file = new File(path, name);
    if (!file.exists) file.text = this.text;

    return file;
  }

  static homedPath(path: string) {
    return path.startsWith('~') ? homedir + path.substring(1) : path;
  }

  static glob(pattern: string, name?: ?string, options?: Object): File[] {
    const files = [];

    glob(battleCasex(this.constructor.homedPath(pattern), name), options).forEach(path => {
      const isDirectory = fs.lstatSync(path).isDirectory();
      if (!isDirectory) files.push(new File(path));
    });

    return files;
  }

  static exists(path: string) {
    return fs.existsSync(path);
  }

  static binary(path: string) {
    return isBinaryFile.sync(path);
  }

  static read(path: string) {
    return fs.readFileSync(path, 'utf8');
  }

  static delete(path: string) {
    fs.unlinkSync(path);
  }

  static chmod(path: string, mode: number) {
    fs.chmodSync(path, mode);
  }

  static exec(path: string) {}

  /*
   * File management
   */

  get binary(): boolean {
    return this.exists && this.constructor.binary(this.path);
  }

  get exists(): boolean {
    return this.constructor.exists(this.path);
  }

  get name(): string {
    const ext = this.extension;
    return this.filename.substring(0, this.filename.length - ext.length);
  }

  get filename(): string {
    return basename(this.path);
  }

  get dirname(): string {
    return dirname(this.path);
  }

  get absolutePath() {
    return resolve(this.path);
  }

  get folder(): string {
    return this.dirname.split('/').pop();
  }

  get extension(): string {
    return extname(this.path);
  }

  save(): this {
    this.saveAs(this.path);
    return this;
  }

  saveAs(path: string, name?: ?string): File {
    if (path.endsWith('/')) path += this.filename;
    path = this.constructor.homedPath(battleCasex(path, name));

    const creating = !this.constructor.exists(path);
    mkdirp.sync(dirname(path));

    if (this.binary) {
      fs.createReadStream(this.path).pipe(fs.createWriteStream(path));
    } else {
      fs.writeFileSync(path, battleCasex(this.text, name));
    }

    if (creating) logger.success(`✅  File created: ${path}`);
    else logger.success(`☑️  File updated: ${path}`);

    return new File(path);
  }

  saveAsRemote(remote: Remote, path: string, name?: string): RemoteFile {}

  move(path: string, name?: ?string): this {
    this.read();
    this.delete();

    this.path = battleCasex(path, name);
    return this.save();
  }

  rename(path: string, name?: ?string) {
    let filename = path;
    if (!filename.includes('.')) filename += this.extension;

    return this.move(`${this.dirname}/${filename}`, name);
  }

  delete(): void {
    this.constructor.delete(this.path);
    logger.success(`🔥  File deleted: ${this.path}`);
  }

  chmod(mode: number): this {
    this.constructor.chmod(this.path, mode);
    return this;
  }

  exec(args?: string): this {
    return this.constructor.exec(args);
  }

  /*
   * Text helpers
   */

  read() {
    this.text = this.exists ? this.constructor.read(this.path) : '';
  }

  get text(): string {
    return this.lines.map(line => line.text).join(this.constructor.EOL);
  }

  get textArray(): string[] {
    return this.lines.textArray;
  }

  set text(text: string): void {
    this.lines = text.split(LINE_BREAK);
  }

  line(index: number): Line {
    return this._lines[index];
  }

  get lines(): LineCollectionType {
    if (this.binary) throw new Error('Attempting to treat binary file as text');

    if (!this._lines) this.read();
    return this._lines;
  }

  set lines(texts: string[]): void {
    this._lines = new LineCollection();
    this.add(0, texts);
  }

  get stub() {
    const fn = function() {
      return this.stub;
    };

    fn.stub = true;

    return new Proxy(fn, {
      get: () => {
        return this.stub;
      }
    });
  }

  stubSearch(search: string, name: string) {
    let warning = `Unable to find search ${search}`;
    if (name) warning += ` with name ${name}`;
    logger.warn(warning);

    return this.stub;
  }

  find(search: string, name?: string): Line {
    return this.all(search, name, { limit: 1 })[0] || this.stubSearch(search, name);
  }

  first(search: string, name?: string) {
    return this.find(search, name);
  }

  replace(search: string, replacement: string) {
    this.find(search).replace(search, replacement);
    return this;
  }

  last(search: string, name?: string): Line {
    const options = { limit: 1, lines: this.lines.slice().reverse() };
    return this.all(search, name, options)[0] || this.stubSearch(search, name);
  }

  all(search: string = '', name?: string, options: Object = {}): LineCollectionType {
    const collection: LineCollectionType = new LineCollection();

    search = battleCasex(search, name);
    const limit = options.limit || 1;
    const lines = options.lines || this.lines;

    lines.forEach((line: Line) => {
      if (line.text.includes(search)) collection.push(line);
      if (collection.length >= limit) return false;
    });

    return collection;
  }

  consecutive(search: string): LineCollectionType {
    return this.find(search).untilLast(search);
  }

  add(index: number, items: any): LineCollectionType {
    if (!Array.isArray(items)) items = [items];

    const collection: LineCollectionType = new LineCollection();
    collection.push(...items.map(item => (item instanceof Line ? item : new Line(this, item))));

    this._lines.splice(index, 0, ...collection);
    return collection;
  }

  prepend(items: any): LineCollectionType {
    return this.add(0, items);
  }

  append(items: any): LineCollectionType {
    return this.add(this.lines.length, items);
  }

  remove(line: number | Line) {
    const index = typeof line === 'number' ? line : line.index;
    this.lines.splice(index, 1);
  }
}
