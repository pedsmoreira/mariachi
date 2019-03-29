// @flow

import program from 'commander';
import chalk from 'chalk';
import casex from 'casex';

import Generator from '../Generator';
import { logger } from '../helpers';

import Option, { type OptionProps } from './Option';
import CommandArg from './Arg';

export type CommandConfig = {
  args?: string,
  options?: { [string]: OptionProps },
  description?: string
};

export default class Command {
  generator: Generator;
  name: string;

  constructor(generator: Generator, name: string) {
    this.generator = generator;
    this.name = name;
  }

  get alias(): ?string {
    return this.generator.battlecry.alias(this.name);
  }

  get config(): CommandConfig {
    return this.generator.config[this.name];
  }

  get options(): Option[] {
    const options = this.config.options || {};
    return Object.keys(options).map(name => new Option(name, options[name]));
  }

  get commanderArgs(): string {
    const args = this.config.args;
    if (!args) return '';

    return args
      .split(' ')
      .map(arg => new CommandArg(arg).commanderSignature)
      .join(' ');
  }

  get commanderName() {
    return this.options.name || casex(this.name, 'na-me');
  }

  get commanderInstruction(): string {
    return `${this.commanderName}-${this.generator.name} ${this.commanderArgs}`;
  }

  get commanderAction(): Function {
    const command = this;

    return function() {
      command.generator.battlecry.executed = true;

      command.generator
        .setArgsArray(command.name, this.parent.args)
        .setOptions(this.opts())
        .play(command.name);
    };
  }

  register(): void {
    const cmd = program
      // $FlowFixMe
      .command(this.commanderInstruction, '', { noHelp: true })
      .action(this.commanderAction);

    this.options.forEach(option => cmd.option(option.commanderFlags, option.description, option.defaultArg));
  }

  help(): void {
    logger.emptyLine();
    this.helpTitle();

    logger.addIndentation();
    this.options.forEach(option => option.help());
    logger.removeIndentation();
  }

  helpTitle() {
    const { args, description } = this.config;

    const name = chalk.hex(logger.BRASIL_GREEN)(this.alias || this.commanderName);
    const generatorName = chalk.hex(logger.BRASIL_YELLOW)(this.generator.name);
    let text = `cry ${name} ${generatorName} ${args || ''}`;

    logger.default(text);
    if (description) logger.log(chalk.hex(logger.MUTED), description);
  }
}
