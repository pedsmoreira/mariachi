import { Generator, command } from 'battlecry';

export default class __NaMe__Generator extends Generator {
  compatibility = '1.x';

  @command({ args: 'name', description: 'Create a new __na me__' })
  @command.option('special', { description: 'Special option' })
  generate() {
    this.templates().forEach(file => file.saveAs(`src/_na-me_s/`, this.args.name));
  }
}
