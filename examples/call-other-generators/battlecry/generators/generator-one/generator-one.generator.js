import { Strategy } from 'battlecry';

export default class StrategyOneStrategy extends Strategy {
  config = {
    generate: {
      args: 'name'
    }
  };

  generate() {
    this.strategy('strategy-two')
      .setArgs({ name: this.args.name })
      .setOptions({ special: true })
      .play('generate');
  }
}
