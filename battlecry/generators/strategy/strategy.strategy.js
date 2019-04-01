import { Strategy, command } from 'battlecry';

export default class StrategyStrategy extends Strategy {
  compatibility = '1.x';

  get folder(): string {
    return `battlecry/strategies/${this.args.name}/`;
  }

  @command({ args: 'name', description: 'Create a new strategy with sample files' })
  generate() {
    this.template('*.strategy.js').saveAs(this.folder, this.args.name);
    this.templates('templates/**').forEach(file => file.saveAs(`${this.folder}templates/`));
  }

  @command({ args: 'name', description: 'Destroy an existing strategy' })
  destroy() {
    this.delete(this.folder);
  }
}
