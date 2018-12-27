import { Generator, command } from 'battlecry';

export default class GeneratorGenerator extends Generator {
  compatibility = '1.x';

  get folder(): string {
    return `battlecry/generators/${this.args.name}/`;
  }

  @command({ args: 'name', description: 'Create a new generator with sample files' })
  generate() {
    this.template('*.generator.js').saveAs(this.folder, this.args.name);
    this.templates('templates/**').forEach(file => file.saveAs(`${this.folder}templates/`));
  }

  @command({ args: 'name', description: 'Destroy an existing generator' })
  destroy() {
    this.delete(this.folder);
  }
}
