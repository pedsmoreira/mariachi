import program from 'commander';
import { basename } from 'path';
import fs from 'fs';
import chalk from 'chalk';

import pkg from '../package.json';

import Strategy from './Strategy';
import glob, { defaultGlobOptions } from './File/glob';
import { logger } from './helpers';

type NamedArgv = {
  node: string,
  bin: string,
  method: string,
  strategy: string,
  rest: string[]
};

export default class Battlecry {
  argv: string[];
  namedArgv: NamedArgv;

  executed: boolean;

  aliases: { [alias: string]: string } = {};
  strategies: { [name: string]: Strategy } = {};

  constructor(argv: string[]) {
    this.argv = argv;

    const [node, bin, method, strategy, ...rest] = argv;
    this.namedArgv = {
      node,
      bin,
      method,
      strategy,
      rest
    };
  }

  get version(): string {
    return pkg.version;
  }

  load(path: string) {
    this.setup(path);
    glob(`${path}/strategies/*/*.strategy.js`).forEach(path => {
      const strategyClass = require(path).default;
      const name = basename(path, '.strategy.js');

      if (!strategyClass) return logger.warn(`Skipping strategy ${basename(path)} - missing export default`);
      this.strategies[name] = this.createStrategy(name, path, strategyClass);
    });
  }

  setup(path: string) {
    const setupPath = `${path}/battlecry-setup.js`;
    const setupExists = fs.existsSync(`${setupPath}`);

    if (setupExists) {
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

  strategy(name: string): Strategy {
    return this.createStrategy(name, this.strategies[name].path, this.strategies[name].constructor);
  }

  createStrategy(name: string, path: string, StrategyClass: typeof Strategy): Strategy {
    const strategy = new StrategyClass();
    strategy.name = name;
    strategy.battlecry = this;
    strategy.path = path;

    return strategy;
  }

  register() {
    Object.keys(this.strategies).forEach(name => this.strategies[name].register());
  }

  singleHelp(strategy: Strategy) {
    logger.default(`Help for ${strategy.name} strategy:`);
    logger.emptyLine();

    strategy.help();
    logger.emptyLine();

    logger.default(`To show all strategies run --help without a strategy name`);
    logger.emptyLine();
  }

  help() {
    const singleStrategy = this.strategies[this.namedArgv.strategy];
    if (singleStrategy) return this.singleHelp(singleStrategy);

    Object.values(this.strategies).forEach((strategy: any) => {
      strategy.help();
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
    const { node, bin, method, strategy, rest } = this.namedArgv;

    if (['--about', '-A'].includes(method)) this.about();
    if (['--help', '-h', '--version', '-V'].includes(method)) return this.argv;

    const aliasedMethod = this.aliases[method] || method;
    return [node, bin, `${aliasedMethod}-${strategy}`, ...rest];
  }

  play() {
    this.register();

    program
      .version(this.version)
      .usage('<method> <strategy> [args] [options]')
      .option('-A, --about', 'output info about Battlecry contributors')
      .on('--help', () => this.help())
      .parse(this.transmutedArgv);

    if (!this.executed) {
      program.outputHelp();

      logger.warn('Command not found. Check the commands available above');
      logger.emptyLine();
    }
  }
}
