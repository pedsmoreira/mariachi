// @flow

import withMethodMissing from '../helpers/withMethodMissing';

import Line from './Line';

export type LineCollectionType = Line & Array<Line> & LineCollection;

@withMethodMissing
export default class LineCollection {
  _proxy: Proxy<LineCollection>;

  lines: Line[];

  constructor(...lines: Line[]) {
    this.lines = lines;
  }

  get first(): Line {
    return this.lines[0];
  }

  get last(): Line {
    return this.lines[this.lines.length - 1];
  }

  dive() {
    this.lines.shift();
    this.lines.pop();
    return this._proxy;
  }

  surface() {
    this.lines.unshift(this.first.previous);
    this.lines.push(this.last.next);
    return this._proxy;
  }

  add(value: Line | LineCollection | (this => Line | LineCollection)) {
    if (typeof value === 'function') value = value(this);

    if (value instanceof Line) this.lines.push(value);
    else this.lines.push(...value.lines);

    this.lines.sort((a, b) => a.index - b.index);
    return this._proxy;
  }

  sort(): LineCollectionType {
    const indexes = this.lines.map(line => line.index);

    this.lines.sort((a, b) => {
      const textA = a.text.toLowerCase();
      const textB = b.text.toLowerCase();

      return textA < textB ? -1 : textA > textB ? 1 : 0;
    });

    this.lines.forEach((line, index) => line.move(indexes[index]));

    // $FlowFixMe
    return this._proxy;
  }

  trailing(str: string): LineCollectionType {
    // $FlowFixMe
    this._proxy.rightPad(str).last.rightUnpad(str);

    // $FlowFixMe
    return this._proxy;
  }

  // $FlowFixMe
  *[Symbol.iterator]() {
    yield* this.lines;
  }

  __methodMissing__(name: any, args: any[]) {
    const isArrayProperty = !!Array.prototype[name];
    return isArrayProperty ? this._callArrayProperty(name, args) : this._callEachInArrayMethod(name, args);
  }

  _callArrayProperty(name: string, args: any[]) {
    // $FlowFixMe
    return this.lines[name](...args);
  }

  _callEachInArrayMethod(name: string, args: any[]) {
    this.lines.forEach(line => {
      // $FlowFixMe
      const fn: Function = line[name];
      if (!fn) throw new Error(`Method ${name} does not exist in Line`);

      fn.bind(line)(...args);
    });

    return this._proxy;
  }

  _createMethodMissingFn(target: Object, name: any, defaultFn: Function) {
    const number = parseInt(name, 10);
    const isNumber = !isNaN(number);

    return !isNumber ? defaultFn : this.lines[name];
  }

  toString() {
    return this.lines;
  }
}
