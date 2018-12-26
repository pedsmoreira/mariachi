// @flow

import program from 'commander';
import chalk from 'chalk';

import Generator from './Generator';
import OptionBuilder, { type OptionProperties } from './OptionBuilder';
import ArgBuilder from './ArgBuilder';

import logger from '../helpers/logger';

export type MethodConfig = {
  options?: OptionProperties,
  args?: string,
  description?: string
};

export default class GeneratorMethod {
  generator: Generator;
  name: string;

  constructor(generator: Generator, name: string) {
    this.generator = generator;
    this.name = name;
  }

  get alias(): ?string {
    return this.generator.battlecry.alias(this.name);
  }

  get config(): MethodConfig {
    return this.generator.config[this.name];
  }

  get argBuilders(): string {
    const args = this.config.args;
    if (!args) return '';

    return args
      .split(' ')
      .map(arg => new ArgBuilder(arg).build())
      .join(' ');
  }

  get options() {
    return this.config.options || {};
  }

  get optionBuilders(): OptionBuilder[] {
    return Object.keys(this.options).map(name => new OptionBuilder(name, this.options[name]));
  }

  get defaultOptions() {
    const defaults = {};

    const options = this.config.options || {};
    Object.keys(options).forEach(name => {
      const option = this.options[name];
      if (option.default !== undefined) defaults[name] = option.default;
    });

    return defaults;
  }

  get command(): string {
    return `${this.name}-${this.generator.name} ${this.argBuilders}`;
  }

  get action(): Function {
    const method = this;

    return function() {
      method.generator.battlecry.executed = true;

      method.generator
        .setArgsArray(method.name, this.parent.args)
        .setOptions(this.opts())
        .play(method.name);
    };
  }

  register(): void {
    const cmd = program
      // $FlowFixMe
      .command(this.command, '', { noHelp: true })
      .action(this.action);

    this.optionBuilders.forEach(option => cmd.option(option.build(), option.description));
  }

  help(): void {
    logger.emptyLine();
    this.helpTitle();

    this.optionBuilders.forEach(option => option.help());
  }

  helpTitle() {
    const { args, description } = this.config;

    const name = chalk.hex(logger.BRASIL_GREEN)(this.alias || this.name);
    const generatorName = chalk.hex(logger.BRASIL_YELLOW)(this.generator.name);
    let text = `cry ${name} ${generatorName} ${args || ''}`;

    logger.default(text);
    if (description) logger.log(chalk.hex(logger.MUTED), description);
  }
}
