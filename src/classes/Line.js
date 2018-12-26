// @flow

import { replacePatterns } from 'battle-casex';

import indentation from '../helpers/indentation';

import File from './File';
import LineCollection, { type LineCollectionType } from './LineCollection';

export default class Line {
  file: File;
  text: string;

  constructor(file: File, text: string) {
    // Avoid listing file on console.log
    Object.defineProperty(this, 'file', { value: file, enumerable: false, writable: true });

    this.text = text;
  }

  get index() {
    return this.file.lines.indexOf(this);
  }

  name(name: string): this {
    this.text = replacePatterns(this.text, name);
    return this;
  }

  replace(search: string | RegExp, replace: string): this {
    this.text = this.text.replace(search, replacePatterns(replace, name));
    return this;
  }

  before(...texts: string[]): LineCollectionType {
    return this.file.add(this.index, texts);
  }

  after(...texts: string[]): LineCollectionType {
    return this.file.add(this.index + 1, texts);
  }

  until(line: Line | number): LineCollectionType {
    const index = typeof line === 'number' ? line : line.index;

    const start = Math.min(this.index, index);
    const end = Math.max(this.index, index);

    return new LineCollection(...this.file.lines.slice(start, end));
  }

  prepend(text: string, name?: string): this {
    this.text = replacePatterns(`${text}${this.text}`, name);
    return this;
  }

  leftPad(text: string, name?: string): this {
    return this.text.startsWith(text) ? this : this.prepend(text, name);
  }

  append(text: string, name?: string): this {
    this.text += text;
    return this;
  }

  rightPad(text: string, name?: string): this {
    return this.text.endsWith(text) ? this : this.append(text, name);
  }

  replace(search: string | RegExp, text: string, name?: string): this {
    text = replacePatterns(text, name);
    this.text = this.text.replace(search, text);
    return this;
  }

  get first(): boolean {
    return this.index === 0;
  }

  get last(): boolean {
    return this.index === this.file.lines.length - 1;
  }

  get previous(): Line {
    if (this.first) throw new Error('Attempting to call "previous" on first line of the file.');
    return this.file.lines[this.index - 1];
  }

  get next(): Line {
    if (this.last) throw new Error('Attempting to call "last" on last line of the file.');
    return this.file.lines[this.index + 1];
  }

  get enclosing(): Line {
    const length = this.indentation.length;
    let iterator: Line = this;

    while ((iterator = iterator.next)) {
      if (iterator.indentation.length <= length) return iterator;
    }

    throw new Error(`Unable to find an enclosing line that matches the indentation "${this.indentation}"`);
  }

  get indentation() {
    return indentation(this.text);
  }

  replaceIndentation(str?: string) {
    this.replace(this.indentation, str || this.previous.indentation);
    return this;
  }

  indent(): this {
    return this.prepend(this.previous.indentation);
  }

  remove() {
    this.file.remove(this);
  }
}
