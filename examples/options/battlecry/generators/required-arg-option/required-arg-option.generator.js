import { Strategy } from 'battlecry';

export default class RequiredArgOptionStrategy extends Strategy {
  config = {
    generate: {
      args: 'name',
      options: {
        filename: { description: 'Change destination filename', arg: 'required' }
      },
      description: 'Example strategy method that have an option with optional arg'
    }
  };

  generate() {
    const file = this.template('*.java');

    const filename = this.options.filename || file.filename;
    file.saveAs(`it-worked/required-arg-options/${filename}`, this.args.name);
  }
}
