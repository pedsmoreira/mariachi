// @flow

import ArgBuilder from './classes/ArgBuilder';
import File from './classes/File';
import Generator from './classes/Generator';
import GeneratorMethod from './classes/GeneratorMethod';
import OptionBuilder from './classes/OptionBuilder';
import Battlecry from './classes/Battlecry';

import dd from './helpers/dd';
import log from './helpers/log';

import { EOL } from 'os';
import { configure } from 'battle-casex';

configure({ eol: EOL });

export { ArgBuilder, File, Generator, GeneratorMethod, OptionBuilder, Battlecry, dd, log };
