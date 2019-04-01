import battleCasex from 'battle-casex';

import File from './File';
import LineCollection, { LineCollectionType } from './LineCollection';

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
    this.text = battleCasex(this.text, name);
    return this;
  }

  replace(search: string | RegExp, text: string, name?: string): this {
    text = battleCasex(text, name);
    this.text = this.text.replace(search, text);
    return this;
  }

  before(...texts: string[]): LineCollectionType {
    return this.file.add(this.index, texts);
  }

  after(...texts: string[]): LineCollectionType {
    return this.file.add(this.index + 1, texts);
  }

  until(value: Line | number | Function): LineCollectionType {
    let index: number = 0;

    if (typeof value === 'number') index = value;
    else if (value instanceof Line) index = value.index;
    else {
      index = this.allNext.find(line => line.last || value(line)).index;
    }

    const start = Math.min(this.index, index);
    const end = Math.max(this.index, index);

    return new LineCollection(...this.file.lines.slice(start, end + 1)) as any;
  }

  untilLast(search: string | Function): LineCollectionType {
    const lastMatching: Line = this.allNext.find(line => {
      return line.last || typeof search === 'string' ? !line.text.includes(search as any) : !search(line);
    });

    return this.until(lastMatching.previous);
  }

  get untilEnclosing(): LineCollectionType {
    return this.until(this.enclosing);
  }

  prepend(text: string, name?: string): this {
    this.text = `${battleCasex(text, name)}${this.text}`;
    return this;
  }

  leftPad(text: string, name?: string): this {
    text = battleCasex(text, name);
    return this.text.startsWith(text) ? this : this.prepend(text, name);
  }

  leftUnpad(text: string, name?: string): this {
    text = battleCasex(text, name);
    if (this.text.startsWith(text)) this.text = this.text.substring(text.length, this.text.length);
    return this;
  }

  append(text: string, name?: string): this {
    this.text += text;
    return this;
  }

  rightPad(text: string, name?: string): this {
    text = battleCasex(text, name);
    return this.text.endsWith(text) ? this : this.append(text, name);
  }

  rightUnpad(text: string, name?: string): this {
    text = battleCasex(text, name);
    if (this.text.endsWith(text)) this.text = this.text.substring(0, this.text.length - text.length);
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

  get allPrevious(): LineCollectionType {
    return new LineCollection(...this.file.lines.slice(0, this.index)) as any;
  }

  get next(): Line {
    if (this.last) throw new Error('Attempting to call "last" on last line of the file.');
    return this.file.lines[this.index + 1];
  }

  get allNext(): LineCollectionType {
    return new LineCollection(...this.file.lines.slice(this.index + 1)) as any;
  }

  up(): this {
    if (this.first) throw new Error('Attempting to call "up" on first line of the file.');
    return this.move(this.index - 1);
  }

  down(): this {
    if (this.last) throw new Error('Attempting to call "down" on last line of the file.');
    return this.move(this.index + 1);
  }

  move(index: number): this {
    this.remove();
    this.file.add(index, this);

    return this;
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
    return this.text.match(/^[\s]*/g)[0];
  }

  replaceIndentation(str?: string) {
    this.replace(this.indentation, str || this.previous.indentation);
    return this;
  }

  indent(): this {
    return this.prepend(this.previous.indentation);
  }

  remove(amount: number = 1) {
    this.until(this.index + amount - 1).forEach(line => this.file.remove(line));
  }
}
