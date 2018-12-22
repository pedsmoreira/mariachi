// @flow

import chalk from 'chalk';
import spaces from './spaces';

const INDENTATION = 3;

class Log {
  indentation: number = INDENTATION;
  hasEmptyLine: boolean = false;

  BRASIL_GREEN = '#009B3A';
  BRASIL_YELLOW = '#FEDF00';
  BRASIL_BLUE = '#002776';

  MUTED = '#AAA';

  addIndentation() {
    this.indentation += INDENTATION;
  }

  removeIndentation() {
    if (this.indentation) this.indentation -= INDENTATION;
  }

  log(chalker: Function, message: string) {
    this.hasEmptyLine = false;
    console.log(chalker(spaces(this.indentation, message)));
  }

  default(message: string) {
    return this.log(chalkedMessage => chalkedMessage, message);
  }

  success(message: string) {
    this.log(chalk.hex(this.BRASIL_GREEN), message);
  }

  warn(message: string) {
    this.log(chalk, `⚠️  ${message}`);
  }

  error(message: string) {
    this.log(chalk.red, message);
  }

  emptyLine() {
    if (this.hasEmptyLine) return;

    this.hasEmptyLine = true;
    console.log();
  }
}

export default new Log();
