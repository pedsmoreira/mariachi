import { Strategy, command } from 'battlecry';
import GitDownload from './GitDownload';

export default class KitStrategy extends Strategy {
  compatibility = '1.x';

  @command({ args: 'repository', description: 'Download one or more strategies from GitHub' })
  @command.option('dir', { description: 'The repository directory to look into', arg: 'required' })
  download() {
    return new GitDownload(this.args.repository, this.options.dir).handle();
  }
}
