// @flow

import { Generator, command, description, option } from 'battlecry';
import GitDownload from './GitDownload';

export default class GeneratorGenerator extends Generator {
  compatibility = '1.x';

  get nameArg(): string {
    // $FlowFixMe
    return this.args.name;
  }

  get folder(): string {
    return `battlecry/generators/${this.nameArg}/`;
  }

  @command('name')
  @description('Create a new generator with sample files')
  generate() {
    this.template('*.generator.js').saveAs(this.folder, this.nameArg);
    this.templates('templates/**').forEach(file => file.saveAs(`${this.folder}templates/`));
  }

  @command('name')
  @description('Destroy an existing generator')
  destroy() {
    this.delete(this.folder);
  }
}
