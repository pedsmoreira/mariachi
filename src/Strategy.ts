import { join, basename, dirname } from 'path';
import rimraf from 'rimraf';
import battleCasex from 'battle-casex';
import semver from 'semver';

import File from './File';
import { FileCollectionType } from './File/FileCollection';
import Battlecry from './Battlecry';
import Command, { CommandConfig } from './Command';

import { dd, exec, ExecOptions, logger } from './helpers';

type Args = { [name: string]: string | string[] };
type Options = { [name: string]: string };

export default class Strategy {
  options: Options;
  args: Args;

  /*
   * Register
   */

  name: string;
  path: string;
  battlecry: Battlecry;
  compatibility: string | string[];

  currentCommand: Command;

  config: { [method: string]: CommandConfig };
  static decoratedConfig: { [method: string]: CommandConfig };

  constructor() {
    this.config = (this.constructor as any).decoratedConfig;
  }

  get basename() {
    return basename(this.path);
  }

  get commands(): Command[] {
    return Object.keys(this.config || {}).map(method => new Command(this, method));
  }

  command(name: string) {
    return this.commands.find(command => command.name === name);
  }

  register(): void {
    this.logRegistrationWarnings();
    this.commands.forEach(command => command.register());
  }

  get compatible() {
    return semver.satisfies(this.battlecry.version, this.compatibility);
  }

  async play(methodName: string): Promise<any> {
    try {
      const method: Function = this[methodName];
      if (!method) this.throwMethodNotImplemented(methodName);

      const command = this.command(methodName);
      if (!command) this.throwMethodNotRegistered(methodName);

      logger.emptyLine();
      logger.action(`🥁 Playing: ${methodName} ${this.name}`);
      logger.addIndentation();

      const previousCommand = this.currentCommand;
      this.currentCommand = command;

      const response = method.bind(this)();
      if (response) await response;

      this.currentCommand = previousCommand;

      logger.removeIndentation();
      logger.emptyLine();
    } catch (error) {
      // Async/await must be wrapped by a try catch
      dd(error);
    }
  }

  /*
   * File Helpers
   */

  ensureDir(path: string, name?: string | null) {
    File.ensureDir(battleCasex(path, name));
  }

  file(pattern: string, name?: string | null, globOptions?: Object): File {
    const files = this.files(pattern, name, globOptions);
    if (!files.length) {
      const path = battleCasex(pattern, name);
      this.logLabeledWarn('File not found', `A new File instance was created for path "${path}"`);
      return new File(path);
    }

    return files[0];
  }

  files(pattern: string, name?: string | null, globOptions?: Object): FileCollectionType {
    return File.glob(pattern, name, globOptions);
  }

  delete(path: string, name?: string): void {
    path = battleCasex(path, name);
    rimraf.sync(path);
    logger.success(`🔥 Path deleted: ${path}`);
  }

  /*
   * Template Helpers
   */

  get templatesPath(): string {
    return join(dirname(this.path), 'templates');
  }

  templates(pattern?: string, globOptions?: Object): FileCollectionType {
    const values = [this.templatesPath, '**'];
    if (pattern) values.push(pattern);

    return this.files(join(...values), null, globOptions);
  }

  template(pattern?: string, globOptions?: Object): File {
    return this.templates(pattern, globOptions)[0];
  }

  /*
   * Chain helpers
   */

  strategies(...names: string[]): Strategy[] {
    return names.map(name => this.strategy(name));
  }

  strategy(name?: string): Strategy {
    return this.battlecry.strategy(name || this.name);
  }

  setOptions(options: Options): this {
    this.options = options;
    return this;
  }

  setArgs(args: Args): this {
    this.args = args;
    return this;
  }

  setArgsArray(method: string, values: string[]): this {
    const argsConfig = this.config[method].args;
    if (!argsConfig) return this;

    const args = {};
    argsConfig.split(' ').forEach((argString, index) => {
      const value = values[index];

      const isVariadic = argString.includes('...');
      if (isVariadic && (!value || !value.length)) return;

      const argName = argString.replace('?', '').replace(/[.?]/g, '');
      args[argName] = value;
    });

    return this.setArgs(args);
  }

  /*
   * Other helpers
   */

  exec(command: string, options: ExecOptions = {}) {
    exec(command, options);
  }

  /*
   * Help
   */

  help() {
    logger.default(`🥁  ${this.name}`);

    logger.addIndentation();
    this.logRegistrationWarnings();
    this.commands.forEach(method => method.help());
    logger.removeIndentation();
  }

  /*
   * Logging & Errors
   */

  logRegistrationWarnings() {
    if (!this.commands.length) return this.logLabeledWarn('Empty', 'No methods in config');

    if (!this.compatibility) {
      return this.logLabeledWarn('Compability check skipped', `No compabitility provided`);
    }

    if (!this.compatible) {
      return this.logLabeledWarn(
        'Incompatible',
        `Expected '${this.compatibility.toString()}' but the installed battlecry version is: '${
          this.battlecry.version
        }'`
      );
    }
  }

  log(message: string, method: 'default' | 'success' | 'action' | 'warn' | 'error' = 'default') {
    logger[method](message);
  }

  logLabeledWarn(label: string, message: string) {
    logger.labeledWarn(this.basename, label, message);
  }

  throwMethodNotImplemented(method: string): void {
    throw new Error(`Method ${method} not implemented on strategy ${this.constructor.name}`);
  }

  throwMethodNotRegistered(method: string): void {
    throw new Error(
      `Method ${method} is not registered. You can register your command using @command or adding it to config = {}`
    );
  }
}
