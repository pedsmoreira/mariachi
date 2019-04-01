import { Strategy } from 'battlecry';

export default class ExampleStrategy extends Strategy {
  config = {
    generate: {
      args: 'name',
      options: {
        special: { description: 'Special option' }
      }
    }
  };

  generate() {
    this.template('README.md')
      .remove(0)
      .saveAs(`__na-me__/`, this.args.name);
  }
}
