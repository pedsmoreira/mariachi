// @flow

import { EOL } from 'os';
import { configure } from 'battle-casex';

configure({ eol: EOL });

export { replacePatterns } from 'battle-casex';

export { default as ArgBuilder } from './classes/ArgBuilder';
export { default as File } from './classes/File';
export { default as Generator } from './classes/Generator';
export { default as GeneratorMethod } from './classes/GeneratorMethod';
export { default as OptionBuilder } from './classes/OptionBuilder';
export { default as Line } from './classes/Line';
export { default as LineCollection } from './classes/LineCollection';
export { default as Battlecry } from './classes/Battlecry';

export { command, option } from './helpers/decorators';
export { default as dd } from './helpers/dd';
export { default as logger } from './helpers/logger';
export { default as memoize } from './helpers/memoize';
export { default as indentation } from './helpers/indentation';
export { default as spaces } from './helpers/spaces';
export { default as withMethodMissing } from './helpers/withMethodMissing';
