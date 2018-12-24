// @flow

import { replacePatterns } from 'battle-casex';
import File from './File';
import LineCollection from './LineCollection';

export default class Line {
  file: File;
  text: string;

  constructor(file: File, text: string) {
    this.file = file;
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

  before(text: string | string[]): LineCollection {
    return this.file.add(this.index, text);
  }

  after(text: string | string[]): LineCollection {
    return this.file.add(this.index + 1, text);
  }

  prepend(text: string, name?: string): this {
    this.text = replacePatterns(`${text}${this.text}`, name);
    return this;
  }

  append(text: string, name?: string): this {
    this.text += text;
    return this;
  }

  replace(search: string | RegExp, text: string, name?: string): this {
    text = replacePatterns(text, name);
    this.text = this.text.replace(search, text);
    return this;
  }

  remove() {
    this.file.remove(this);
  }
}
