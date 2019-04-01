import { Strategy } from 'battlecry';

export default class OptionalArgStrategy extends Strategy {
  config = {
    generate: {
      args: 'name neighborhood?',
      description: 'Example strategy method that have an optional arg'
    }
  };

  generate() {
    const { name, neighborhood } = this.args;

    const template = this.template('*.txt');
    if (neighborhood) template.append('I live in the __Na Me__ neighborhood.', neighborhood);
    template.saveAs(`it-worked/optional-args/`, name);
  }
}
