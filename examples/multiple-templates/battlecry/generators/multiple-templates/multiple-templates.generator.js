import { Strategy } from 'battlecry';

export default class MultipleTemplatesStrategy extends Strategy {
  config = {
    generate: {
      args: 'name'
    }
  };

  generate() {
    this.templates().forEach(file => file.saveAs(`it-worked/multiple-templates/__na-me__/`, this.args.name));
  }
}
