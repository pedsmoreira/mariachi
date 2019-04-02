const program = require('commander');
import { basename } from 'path';
import * as fs from 'fs';
import chalk from 'chalk';

import * as pkg from '../package.json';

import Strategy from './Strategy';
import glob, { defaultGlobOptions } from './File/glob';
import { logger } from './helpers';

type NamedArgv = {
  node: string;
  bin: string;
  method: string;
  strategy: string;
  rest: string[];
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
    this.loadStrategies(`${path}/strategies/*`);
  }

  loadStrategies(path: string) {
    glob(`${path}/**/*.strategy.{js,ts}`).forEach(path => {
      const strategyClass = require(path).default;
      const name = basename(path.split('.strategy.')[0]);

      if (!strategyClass) return logger.warn(`Skipping strategy ${basename(path)} - missing export default`);
      this.strategies[name] = this.createStrategy(name, path, strategyClass);
    });
  }

  setup(path: string) {
    const setupPath = glob(`${path}/battlecry-setup.{js,ts}`)[0];
    if (!setupPath) return;

    const fn: Function = require(setupPath).default;

    if (fn) fn(this);
    else logger.warn(`Skipping battlecry-setup.js in folder ${basename(path)} - empty file`);
  }

  alias(method: string): string | null {
    const values = Object.values(this.aliases);
    const index = values.indexOf(method);

    return index !== -1 ? Object.keys(this.aliases)[index] : null;
  }

  globOptions(globOptions: Object): Object {
    Object.assign(defaultGlobOptions, globOptions);
    return defaultGlobOptions;
  }

  strategy(name: string): Strategy {
    // @ts-ignore
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

    logger.default(`ℹ️ To show all strategies run --help without a strategy name`);
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

  async exec(command: string, options: ExecOptions = {}): Promise<ExecResponse> {
    let logMessage = `🏃 Exec command: \`${command}\``;

    if (options.privateKey) {
      logMessage += ` with private key "${basename(options.privateKey)}"`;
      command = `ssh-agent $(ssh-add ${options.privateKey}; ${command})`;
    }

    if (options.path) {
      logMessage += ` in path "${options.path}"`;
      command = `cd ${options.path}; ${command}`;
    }

    logger.action(logMessage);
    logger.addIndentation();

    const result: any = await new Promise(resolve => {
      const childProcess = exec(command);
      let success = true;
      const messages = [];
      let error;

      childProcess.stdout.on('data', function(data) {
        const lines = data.toString().split(File.EOL);
        messages.push(...lines);
        lines.forEach(line => logger.default(line));
      });

      childProcess.stderr.on('data', function(data) {
        error = data.toString();
        error.split(File.EOL).forEach(line => logger.error(line));
        success = false;
      });

      childProcess.on('exit', function(code) {
        logger[success ? 'success' : 'error']('🔚 Exec exited with status code ' + code.toString());

        const response: ExecResponse = { success, code, error, messages };
        resolve(response);
      });
    });

    logger.removeIndentation();
    return result;
  }
}
