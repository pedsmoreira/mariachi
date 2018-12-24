// @flow

import withMethodMissing from '../helpers/withMethodMissing';

import Line from './Line';

export type LineCollectionType = Line & Array<Line> & LineCollection;

@withMethodMissing
export default class LineCollection {
  lines: Line[];

  constructor(...lines: Line[]) {
    this.lines = lines;
  }

  get first(): Line {
    return this.lines[0];
  }

  get last(): Line {
    return this.lines[this.lines.length];
  }

  // $FlowFixMe
  *[Symbol.iterator]() {
    yield* this.lines;
  }

  __methodMissing__(name: any, args: any[], proxy: Object) {
    const isArrayProperty = !!Array.prototype[name];
    return isArrayProperty ? this._callArrayProperty(name, args) : this._callEachInArrayMethod(name, args, proxy);
  }

  _callArrayProperty(name: string, args: any[]) {
    // $FlowFixMe
    return this.lines[name](...args);
  }

  _callEachInArrayMethod(name: string, args: any[], proxy: Object) {
    this.lines.forEach(line => {
      // $FlowFixMe
      const fn: Function = line[name];
      if (!fn) throw new Error(`Method ${name} does not exist in Line`);

      fn.bind(line)(...args);
    });

    return proxy;
  }

  _createMethodMissingFn(target: Object, name: any, defaultFn: Function) {
    const number = parseInt(name, 10);
    const isNumber = !isNaN(number);

    return !isNumber ? defaultFn : this.lines[name];
  }
}
