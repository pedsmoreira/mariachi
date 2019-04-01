import { Strategy } from 'battlecry';

export default class StrategyTwoStrategy extends Strategy {
  config = {
    generate: {
      args: 'name',
      options: {
        special: { description: 'Special option' }
      }
    }
  };

  generate() {
    let name = this.args.name;
    if (this.options.special) name += '-special';
    this.templates().forEach(file => file.saveAs(`it-worked/strategy-two/`, name));
  }
}
