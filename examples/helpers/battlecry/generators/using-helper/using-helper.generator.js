import { Strategy } from 'battlecry';
import format from 'helpers/format';

export default class UsingHelperStrategy extends Strategy {
  config = {
    generate: {
      args: 'name'
    }
  };

  generate() {
    const file = this.template('*.txt');
    file.text = format(file.text);
    file.saveAs(`it-worked/using-helpers/`, this.args.name);
  }
}
