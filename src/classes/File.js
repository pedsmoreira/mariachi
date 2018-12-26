// @flow

import fs from 'fs';
import mkdirp from 'mkdirp';
import { basename, dirname, extname } from 'path';
import { EOL } from 'os';
import isBinaryFile from 'isbinaryfile';
import { replacePatterns, joinLines } from 'battle-casex';

import glob from '../helpers/glob';
import logger from '../helpers/logger';

import Line from './Line';
import LineCollection, { type LineCollectionType } from './LineCollection';

const LINE_BREAK = /\r?\n/;

export default class File {
  path: string;
  _lines: LineCollectionType;

  constructor(path: string, name?: string) {
    this.path = replacePatterns(path, name);
  }

  existing(path: string, name?: string): File {
    if (path.endsWith('/')) path += this.filename;

    const file = new File(path, name);
    if (!file.exists) file.text = this.text;

    return file;
  }

  static glob(pattern: string, name?: ?string, options?: Object): File[] {
    const files = [];

    glob(replacePatterns(pattern, name), options).forEach(path => {
      const isDirectory = fs.lstatSync(path).isDirectory();
      if (!isDirectory) files.push(new File(path));
    });

    return files;
  }

  /*
   * File management
   */

  get binary(): boolean {
    return this.exists && isBinaryFile.sync(this.path);
  }

  get exists(): boolean {
    return fs.existsSync(this.path);
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

  get extension(): string {
    return extname(this.path);
  }

  save(): this {
    this.saveAs(this.path);
    return this;
  }

  saveAs(path: string, name?: ?string): File {
    if (path.endsWith('/')) path += this.filename;
    path = replacePatterns(path, name);

    const creating = !fs.existsSync(path);
    mkdirp.sync(dirname(path));

    if (this.binary) {
      fs.createReadStream(this.path).pipe(fs.createWriteStream(path));
    } else {
      fs.writeFileSync(path, replacePatterns(this.text, name));
    }

    if (creating) logger.success(`✅  File created: ${path}`);
    else logger.success(`☑️  File updated: ${path}`);

    return new File(path);
  }

  move(path: string, name?: ?string): this {
    this.delete();

    this.path = replacePatterns(path, name);
    return this.save();
  }

  rename(path: string, name?: ?string) {
    let filename = path;
    if (!filename.includes('.')) filename += this.extension;

    return this.move(`${this.dirname}/${filename}`, name);
  }

  delete(): void {
    fs.unlinkSync(this.path);
    logger.success(`🔥  File deleted: ${this.path}`);
  }

  /*
   * Text helpers
   */

  static joinLines(lines: string[]): string {
    return joinLines(lines);
  }

  read() {
    this.text = this.exists ? fs.readFileSync(this.path, 'utf8') : '';
  }

  get text(): string {
    return joinLines(this.lines.map(line => line.text));
  }

  set text(text: string): void {
    this.lines = text.split(LINE_BREAK);
  }

  line(index: number): Line {
    return this._lines.lines[index];
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

  find(search: string, name?: string): Line {
    return this.all(search, name, { limit: 1 })[0] || this.throwSearchNotFound(search);
  }

  last(search: string, name?: string): Line {
    const options = { limit: 1, lines: this.lines.slice().reverse() };
    return this.all(search, name, options)[0] || this.throwSearchNotFound(search);
  }

  all(search: string, name?: string, options: Object = {}): LineCollectionType {
    const collection: LineCollectionType = new LineCollection();

    search = replacePatterns(search, name);
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

  remove(line: number | Line) {
    const index = typeof line === 'number' ? line : line.index;
    this.lines.splice(index, 1);
  }

  throwSearchNotFound(search: string) {
    throw new Error(`'${search}' not found on file ${this.path}`);
  }
}
