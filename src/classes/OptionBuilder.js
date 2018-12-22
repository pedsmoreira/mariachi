// @flow

import chalk from 'chalk';

import logger from '../helpers/logger';

export type OptionProperties = {
  [name: string]: {
    description: string,
    arg?: 'required' | 'optional',
    alias?: string
  }
};

export default class OptionBuilder {
  name: string;
  description: string;
  alias: string;
  arg: ?('required' | 'optional');

  constructor(name: string, properties: Object) {
    this.name = name;
    this.description = properties.description;
    this.arg = properties.arg;
    this.alias = properties.alias || name[0];
  }

  get commanderArg(): string {
    if (this.arg === 'required') return '<value>';
    if (this.arg === 'optional') return '[value]';

    return '';
  }

  build() {
    return `-${this.alias}, --${this.name} ${this.commanderArg}`;
  }

  help() {
    let optionText = chalk.hex(logger.BRASIL_BLUE)(`    -${this.alias} --${this.name}`);

    if (this.arg === 'required') {
      optionText += chalk.cyanBright(` value`);
    } else if (this.arg === 'optional') {
      optionText += chalk.hex('#99C')(` value?`);
    }

    logger.default(`${optionText} \t${chalk.hex(logger.MUTED)(this.description)}`);
  }
}
