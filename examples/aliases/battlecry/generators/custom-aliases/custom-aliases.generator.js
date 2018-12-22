import { Generator, logger } from 'battlecry';

export default class CustomAliasesGenerator extends Generator {
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
