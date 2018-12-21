// @flow

import { Generator } from 'battlecry';

export default class KitGenerator extends Generator {
  config = {
    download: {
      args: 'repository',
      options: {
        dir: { description: 'The repository directory where the generators are located', arg: 'required' }
      },
      description: 'Download one or more generators from GitHub'
    }
  };

  download() {
    // $FlowFixMe
    return new GitDownload(this.args.repository, this.options.dir).handle();
  }
}
