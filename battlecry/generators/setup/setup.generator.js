// @flow

import { Generator } from 'battlecry';

export default class SetupGenerator extends Generator {
  config = {
    generate: {
      description: "Add a battlecry-setup.js file to your project's battlecry folder"
    }
  };

  generate() {
    this.template('battlecry-setup.js').saveAs('battlecry/');
  }
}
