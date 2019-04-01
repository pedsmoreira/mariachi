import { Strategy } from 'battlecry';

export default class CustomAliasOptionStrategy extends Strategy {
  config = {
    generate: {
      args: 'name',
      options: {
        bold: { description: 'Make name bold', alias: 'n' }
      },
      description: 'Example strategy method that have an option with custom alias'
    }
  };

  generate() {
    const file = this.template('*.html');

    let nameText = '__Na Me__';
    if (this.options.bold) nameText = `<b>${nameText}</b>`;

    file.replaceText('@TEXT', `Hi, I'm ${nameText}`, this.args.name);
    file.saveAs(`it-worked/custom-alias-options/`, this.args.name);
  }
}
