// @flow

import { joinLines, options } from 'battle-casex';

export default function spaces(amount: number, lines: string | string[]): string | string[] {
  const spaces = new Array(amount).fill(' ').join('');

  if (Array.isArray(lines)) return lines.map(line => `${spaces}${line}`);
  return `${spaces}${lines}`;
}
