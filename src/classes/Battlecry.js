// @flow

import program from 'commander';
import { basename } from 'path';
import fs from 'fs';
import chalk from 'chalk';

import pkg from '../../package.json';

import Generator from './Generator';

import glob, { defaultOptions as defaultGlobOptions } from '../helpers/glob';
import logger from '../helpers/logger';

type NamedArgv = {
  node: string,
  bin: string,
  method: string,
  generator: string,
  rest: string[]
};

export default class Battlecry {
  argv: string[];
  namedArgv: NamedArgv;

  executed: boolean;

  aliases: { [alias: string]: string } = {};
  generators: { [name: string]: Generator } = {};

  constructor(argv: string[]) {
    this.argv = argv;

    const [node, bin, method, generator, ...rest] = argv;
    this.namedArgv = {
      node,
      bin,
      method,
      generator,
      rest
    };
  }

  load(path: string) {
    this.setup(path);
    glob(`${path}/generators/*/*.generator.js`).forEach(path => {
      // $FlowFixMe
      const generatorClass = require(path).default;
      const name = basename(path, '.generator.js');

      if (!generatorClass) return logger.warn(`Skipping generator ${basename(path)} - missing export default`);
      this.generators[name] = this.createGenerator(name, path, generatorClass);
    });
  }

  setup(path: string) {
    const setupPath = `${path}/battlecry-setup.js`;
    const setupExists = fs.existsSync(`${setupPath}`);

    if (setupExists) {
      // $FlowFixMe
      const fn: Function = require(setupPath).default;

      if (fn) fn(this);
      else logger.warn(`Skipping battlecry-setup.js in folder ${basename(path)} - empty file`);
    }
  }

  alias(method: string): ?string {
    const values = Object.values(this.aliases);
    const index = values.indexOf(method);

    return index !== -1 ? Object.keys(this.aliases)[index] : null;
  }

  globOptions(globOptions: Object): Object {
    Object.assign(defaultGlobOptions, globOptions);
    return defaultGlobOptions;
  }

  generator(name: string): Generator {
    return this.createGenerator(name, this.generators[name].path, this.generators[name].constructor);
  }

  createGenerator(name: string, path: string, generatorClass: typeof Generator): Generator {
    const generator = new generatorClass();
    generator.name = name;
    generator.battlecry = this;
    generator.path = path;

    return generator;
  }

  register() {
    Object.keys(this.generators).forEach(name => this.generators[name].register());
  }

  singleHelp(generator: Generator) {
    logger.default(`Help for ${generator.name} generator:`);
    logger.emptyLine();

    generator.help();
    logger.emptyLine();

    logger.default(`To show all generators run --help without a generator name`);
    logger.emptyLine();
  }

  help() {
    const singleGenerator = this.generators[this.namedArgv.generator];
    if (singleGenerator) return this.singleHelp(singleGenerator);

    Object.values(this.generators).forEach((generator: any) => {
      generator.help();
      logger.emptyLine();
    });
  }

  about() {
    logger.emptyLine();
    logger.log(
      chalk.bold,
      chalk.hex(logger.BRASIL_GREEN)('🥁 Bat') +
        chalk.hex(logger.BRASIL_YELLOW)('tle') +
        chalk.hex(logger.BRASIL_BLUE)('cry') +
        ': Open source scaffolding CLI for everyone'
    );
    logger.emptyLine();

    logger.emptyLine();
    logger.default('📁 Docs:');
    logger.emptyLine();
    logger.success('https://battlecry.js.org');
    logger.emptyLine();

    logger.emptyLine();
    logger.default('Creator:');
    logger.emptyLine();

    logger.success(`🇧🇷  Pedro S. Moreira`);
    logger.addIndentation();
    logger.log(chalk.hex(logger.BRASIL_BLUE), '🌎  http://pedrosm.com/');
    logger.log(chalk.hex(logger.BRASIL_YELLOW), '💻  https://github.com/pedsmoreira');

    logger.emptyLine();
    process.exit();
  }

  get transmutedArgv(): string[] {
    const { node, bin, method, generator, rest } = this.namedArgv;

    if (['--about', '-A'].includes(method)) this.about();
    if (['--help', '-h', '--version', '-V'].includes(method)) return this.argv;

    const aliasedMethod = this.aliases[method] || method;
    return [node, bin, `${aliasedMethod}-${generator}`, ...rest];
  }

  play() {
    this.register();

    program
      // $FlowFixMe
      .version(pkg.version)
      .usage('<method> <generator> [args] [options]')
      .option('-A, --about', 'output info about Battlecry contributors')
      .on('--help', () => this.help())
      .parse(this.transmutedArgv);

    if (!this.executed) {
      program.outputHelp();

      // $FlowFixMe
      logger.warn('Command not found. Check the commands available above');
      logger.emptyLine();
    }
  }
}
