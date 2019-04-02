import File from '../File';

import logger from './logger';

export default function dd(error: Error) {
  logger.error(`❌ Error: ${error.message}`);
  logger.emptyLine();

  const file = new File('battlecry-error.log');
  file.text = error.stack;
  file.save();

  logger.emptyLine();
  logger.default('🗄  Please check the file battlecry-error.log for the full stack');
  logger.emptyLine();
  process.exit();
}
