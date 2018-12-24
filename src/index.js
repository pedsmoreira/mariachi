// @flow

import ArgBuilder from './classes/ArgBuilder';
import File from './classes/File';
import Generator from './classes/Generator';
import GeneratorMethod from './classes/GeneratorMethod';
import OptionBuilder from './classes/OptionBuilder';
import Line from './classes/Line';
import LineCollection from './classes/LineCollection';
import Battlecry from './classes/Battlecry';

import dd from './helpers/dd';
import logger from './helpers/logger';
import memoize from './helpers/memoize';
import indentation from './helpers/indentation';
import spaces from './helpers/spaces';
import withMethodMissing from './helpers/withMethodMissing';

import { EOL } from 'os';
import { replacePatterns, configure } from 'battle-casex';

configure({ eol: EOL });

export {
  ArgBuilder,
  File,
  Generator,
  GeneratorMethod,
  OptionBuilder,
  Line,
  LineCollection,
  Battlecry,
  dd,
  logger,
  memoize,
  indentation,
  spaces,
  withMethodMissing,
  replacePatterns
};
