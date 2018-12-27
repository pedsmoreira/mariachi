import { Generator, command, description, option } from 'battlecry';

export default class __NaMe__Generator extends Generator {
  compatibility = '1.x';

  @command('name')
  @option('special', { description: 'Special option' })
  @description('Create a new __na me__')
  generate() {
    this.templates().forEach(file => file.saveAs(`src/_na-me_s/`, this.args.name));
  }
}
