import { Strategy, command, logger } from 'battlecry';

export default class TinkerStrategy extends Strategy {
  compatibility = '1.x';

  @command({ description: 'Tinker using battlecry' })
  async use() {
    const previousIndentation = logger.indentation;
    logger.indentation = 0;

    let instructions;
    while (true) {
      instructions = await this.ask('');
      if (instructions === 'exit') break;

      try {
        logger.default(eval(instructions));
      } catch (e) {
        logger.error(e.message);
      }
    }

    logger.indentation = previousIndentation;
  }
}
