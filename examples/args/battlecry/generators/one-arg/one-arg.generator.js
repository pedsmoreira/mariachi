import { Strategy } from 'battlecry';

export default class OneArgStrategy extends Strategy {
  config = {
    generate: {
      args: 'name',
      description: 'Example strategy method that uses one arg'
    }
  };

  generate() {
    this.template('*.txt').saveAs(`it-worked/one-arg/`, this.args.name);
  }
}
