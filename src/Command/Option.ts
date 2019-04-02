import chalk from 'chalk';

import { logger } from '../helpers';

export type OptionProps = {
  description: string;
  alias?: string;
  arg?: 'required' | 'optional';
  defaultArg?: string;
};

export default class Option {
  name: string;
  description: string;
  alias: string;
  arg?: 'required' | 'optional';
  defaultArg?: string;

  constructor(name: string, properties: OptionProps) {
    this.name = name;
    this.description = properties.description;
    this.arg = properties.arg;
    this.alias = properties.alias || name[0];
    this.defaultArg = properties.defaultArg;
  }

  get argRequired() {
    return this.arg === 'required';
  }

  get argOptional() {
    return this.arg === 'optional';
  }

  get noArgs() {
    return !this.arg;
  }

  get commanderArg(): string {
    if (this.argRequired) return '<value>';
    if (this.argOptional) return '[value]';

    return '';
  }

  get commanderFlags() {
    return `-${this.alias}, --${this.name} ${this.commanderArg}`;
  }

  help() {
    let optionText = chalk.hex(logger.BRASIL_BLUE)(`-${this.alias} --${this.name}`);

    if (this.arg === 'required') {
      optionText += chalk.cyanBright(` value`);
    } else if (this.arg === 'optional') {
      optionText += chalk.hex('#99C')(` value?`);
    }

    const description = chalk.hex(logger.MUTED)(this.description);

    let defaultArgText = '';
    if (this.defaultArg) defaultArgText = chalk.hex(logger.MUTED)(` ~ Default: ${this.defaultArg || 'false'}`);

    logger.default(`${optionText} \t${description}${defaultArgText}`);
  }
}
