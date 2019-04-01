import { Strategy, logger } from 'battlecry';

export default class CustomAliasesStrategy extends Strategy {
  config = {
    strike: {},
    roll: {}
  };

  strike() {
    logger.success('Strike!!!');
  }

  roll() {
    logger.success("That's how we roll!");
  }
}
