import { Strategy } from 'battlecry';

export default class OptionalArgOptionStrategy extends Strategy {
  config = {
    generate: {
      args: 'name',
      options: {
        cheesy: { description: 'Make the filename cheesy', arg: 'optional' }
      },
      description: 'Example strategy method that have an option with optional arg'
    }
  };

  generate() {
    const { cheesy } = this.options;

    const file = this.template('*.php');

    let filename = file.filename.split('.')[0];
    if (cheesy) filename += '-cheesy';
    if (typeof cheesy === 'string') filename += `-${cheesy}`;

    file.saveAs(`it-worked/optional-arg-options/${filename}${file.extension}`, this.args.name);
  }
}
