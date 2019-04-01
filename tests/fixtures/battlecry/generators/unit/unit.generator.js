import { Strategy } from 'battlecry';

export default class UnitStrategy extends Strategy {
  config = {
    generate: {
      args: 'name',
      options: {
        folder: { description: 'Subfolder to add the test', arg: 'required' }
      }
    }
  };

  get folder(): string {
    const { folder } = this.options;
    return folder ? `${folder}/` : './';
  }

  generate() {
    this.templates().forEach(file => file.saveAs(this.folder, this.args.name));
  }
}
