import { Generator, command, description, option } from 'battlecry';
import GitDownload from './GitDownload';

export default class KitGenerator extends Generator {
  compatibility = '1.x';

  @command('repository')
  @option('dir', { description: 'The repository directory where the generators are located', arg: 'required' })
  @description('Download one or more generators from GitHub')
  download() {
    return new GitDownload(this.args.repository, this.options.dir).handle();
  }
}
