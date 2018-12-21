// @flow

import { Generator } from 'battlecry';
import GitDownload from './GitDownload';

export default class GeneratorGenerator extends Generator {
  config = {
    generate: {
      args: 'name',
      description: 'Generate a new generator'
    },
    destroy: {
      args: 'name',
      description: 'Destroy an existing generator'
    }
  };

  get nameArg(): string {
    // $FlowFixMe
    return this.args.name;
  }

  get folder(): string {
    return `battlecry/generators/${this.nameArg}/`;
  }

  generate() {
    this.template('*.generator.js').saveAs(this.folder, this.nameArg);
    this.templates('templates/**').forEach(file => file.saveAs(`${this.folder}templates/`));
  }

  destroy() {
    this.delete(this.folder);
  }
}
