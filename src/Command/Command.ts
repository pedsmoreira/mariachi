const program = require('commander');
import chalk from 'chalk';
import casex from 'casex';

import Strategy from '../Strategy';
import { logger } from '../helpers';

import Option, { OptionProps } from './Option';
import CommandArg from './Arg';

export type CommandConfig = {
  args?: string,
  options?: { [key: string]: OptionProps },
  description?: string
};

export default class Command {
  strategy: Strategy;
  name: string;

  constructor(strategy: Strategy, name: string) {
    this.strategy = strategy;
    this.name = name;
  }

  get alias(): string | null {
    return this.strategy.battlecry.alias(this.name);
  }

  get config(): CommandConfig {
    return this.strategy.config[this.name];
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
    return this.options['name'] || casex(this.name, 'na-me');
  }

  get commanderInstruction(): string {
    return `${this.commanderName}-${this.strategy.name} ${this.commanderArgs}`;
  }

  get commanderAction(): Function {
    const command = this;

    return function() {
      command.strategy.battlecry.executed = true;

      command.strategy
        .setArgsArray(command.name, this.parent.args)
        .setOptions(this.opts())
        .play(command.name);
    };
  }

  register(): void {
    const cmd = program
      .command(this.commanderInstruction, '', { noHelp: true })
      .action(this.commanderAction as any);

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
    const strategyName = chalk.hex(logger.BRASIL_YELLOW)(this.strategy.name);
    let text = `cry ${name} ${strategyName} ${args || ''}`;

    logger.default(text);
    if (description) logger.log(chalk.hex(logger.MUTED), description);
  }
}
