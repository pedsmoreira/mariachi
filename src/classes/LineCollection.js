// @flow

import withMethodMissing from '../helpers/withMethodMissing';

import Line from './Line';

@withMethodMissing
export default class LineCollection extends Array<Line> {
  methodMissing(name: string, args: any[]) {
    this.forEach(line => {
      // $FlowFixMe
      line[name](...args);
    });
  }
}
