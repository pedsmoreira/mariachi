// @flow

import { EOL } from 'os';
import { configure } from 'battle-casex';

configure({ eol: EOL });

export { replacePatterns } from 'battle-casex';

export { default as Battlecry } from './Battlecry';
export { default as Generator } from './Generator';
export { default as Command } from './Command';
export { default as File, Line, LineCollection } from './File';

export * from './decorators';
export * from './helpers';
