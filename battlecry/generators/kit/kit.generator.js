import { Generator, command, description, option } from 'battlecry';
import GitDownload from './GitDownload';

export default class KitGenerator extends Generator {
  compatibility = '1.x';

  @command({ args: 'repository', description: 'Download one or more generators from GitHub' })
  @option('dir', { description: 'The repository directory where the generators are located', arg: 'required' })
  download() {
    return new GitDownload(this.args.repository, this.options.dir).handle();
  }
}
