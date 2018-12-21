// @flow

import { joinLines, options } from 'battle-casex';

export default function spaces(amount: number, lines: string | string[]): string {
  lines = Array.isArray(lines) ? lines : lines.split(options.eol);
  const spaces = new Array(amount).fill(' ').join('');

  return joinLines(lines.map(line => `${spaces}${line}`));
}
