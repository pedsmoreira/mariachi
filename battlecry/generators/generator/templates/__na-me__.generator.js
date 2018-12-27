import { Generator } from 'battlecry';

export default class __NaMe__Generator extends Generator {
  compatibility = '1.x';

  config = {
    generate: {
      args: 'name',
      options: {
        special: { description: 'Special option' }
      }
      description: 'Create a new __na me__',
    }
  };

  generate() {
    this.templates().forEach(file => file.saveAs(`src/_na-me_s/`, this.args.name));
  }
}
