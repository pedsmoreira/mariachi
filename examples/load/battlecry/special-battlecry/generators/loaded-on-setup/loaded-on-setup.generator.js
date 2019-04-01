import { Strategy } from 'battlecry';

export default class LoadedOnSetupStrategy extends Strategy {
  config = {
    generate: {
      args: 'name'
    }
  };

  generate() {
    this.template('*.txt').saveAs('it-worked/loaded-on-setup/', this.args.name);
  }
}
