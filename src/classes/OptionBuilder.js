// @flow

import chalk from 'chalk';

import logger from '../helpers/logger';

export type OptionProperties = {
  [name: string]: {
    description: string,
    arg?: 'required' | 'optional',
    alias?: string,
    default?: string
  }
};

export default class OptionBuilder {
  name: string;
  description: string;
  alias: string;
  arg: ?('required' | 'optional');
  default: ?string;

  constructor(name: string, properties: Object) {
    this.name = name;
    this.description = properties.description;
    this.arg = properties.arg;
    this.alias = properties.alias || name[0];
    this.default = properties.default === null ? 'null' : properties.default;
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

    const description = chalk.hex(logger.MUTED)(this.description);

    let defaultValue = '';
    if (this.default !== undefined) defaultValue = chalk.hex(logger.MUTED)(` ~ Default: ${this.default || 'false'}`);

    logger.default(`${optionText} \t${description}${defaultValue}`);
  }
}
