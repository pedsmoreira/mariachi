// @flow

import { Generator, command, description, option } from 'battlecry';

export default class KitGenerator extends Generator {
  compatibility = '1.x';

  @command('repository')
  @option('dir', { description: 'The repository directory where the generators are located', arg: 'required' })
  @description('Download one or more generators from GitHub')
  download() {
    // $FlowFixMe
    return new GitDownload(this.args.repository, this.options.dir).handle();
  }
}
