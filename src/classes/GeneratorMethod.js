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

  get args(): string {
    const args = this.config.args;
    if (!args) return '';

    return args
      .split(' ')
      .map(arg => new ArgBuilder(arg).build())
      .join(' ');
  }

  get options(): OptionBuilder[] {
    const options = this.config.options || {};
    return Object.keys(options).map(name => new OptionBuilder(name, options[name]));
  }

  get command(): string {
    return `${this.name}-${this.generator.name} ${this.args}`;
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

    this.options.forEach(option => cmd.option(option.build(), option.description));
  }

  help(): void {
    logger.emptyLine();
    this.helpTitle();

    this.options.forEach(option => option.help());
  }

  helpTitle() {
    const { args, description } = this.config;

    const name = chalk.hex('#009B3A')(this.alias || this.name);
    const generatorName = chalk.yellow(this.generator.name);
    let text = `cry ${name} ${generatorName} ${args || ''}`;

    logger.default(text);
    if (description) logger.log(chalk.hex('#AAA'), description);
  }
}
