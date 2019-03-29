// @flow

import fs from 'fs';
import { join, basename, dirname } from 'path';
import chalk from 'chalk';
import program from 'commander';
import { execSync } from 'child_process';
import rimraf from 'rimraf';
import battleCasex from 'battle-casex';
import semver from 'semver';

import File from './File';
import Battlecry from './Battlecry';
import Command, { type CommandConfig } from './Command';

import { dd, logger } from './helpers';

type Args = { [name: string]: string | string[] };
type Options = { [name: string]: string };

export default class Generator {
  options: Options;
  args: Args;

  /*
   * Register
   */

  name: string;
  path: string;
  battlecry: Battlecry;
  compatibility: string | string[];
  config: { [method: string]: CommandConfig };

  get basename() {
    return basename(this.path);
  }

  get commands(): Command[] {
    return Object.keys(this.config || {}).map(method => new Command(this, method));
  }

  register(): void {
    this.logRegistrationWarnings();
    this.commands.forEach(command => command.register());
  }

  get compatible() {
    return semver.satisfies(this.battlecry.version, this.compatibility);
  }

  /*
   * Actions
   */

  async play(methodName: string): Promise<*> {
    try {
      // $FlowFixMe
      const method: Function = this[methodName];
      if (!method) this.throwMethodNotImplemented(methodName);

      const command = this.commands.find(command => command.name === methodName);
      if (!command) this.throwMethodNotRegistered(methodName);

      logger.emptyLine();
      logger.success(`🥁  Playing: ${methodName} ${this.name}`);
      logger.addIndentation();

      const response = method.bind(this)();
      if (response) await response;

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

  file(pattern: string, name?: ?string, globOptions?: Object): File {
    const files = this.files(pattern, name, globOptions);
    if (!files.length) {
      const path = battleCasex(pattern, name);
      this.logWarn('File not found', `A new File instance was created for path "${path}"`);
      return new File(path);
    }

    return files[0];
  }

  files(pattern: string, name?: ?string, globOptions?: Object): File[] {
    return File.glob(pattern, name, globOptions);
  }

  delete(path: string, name?: string): void {
    path = battleCasex(path, name);
    rimraf.sync(path);
    logger.success(`🔥  Path deleted: ${path}`);
  }

  /*
   * Template Helpers
   */

  get templatesPath(): string {
    return join(dirname(this.path), 'templates');
  }

  templates(pattern?: string, globOptions?: Object): File[] {
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

  generator(name?: string): Generator {
    return this.battlecry.generator(name || this.name);
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

  exec(command: string): string | Buffer {
    logger.success(`🏃  Exec command: ${command}`);
    logger.addIndentation();

    const result = execSync(command, { stdio: 'inherit' });

    logger.removeIndentation();
    return result;
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
    if (!this.commands.length) return this.logWarn('Empty', 'No methods in config');

    if (!this.compatibility) {
      return this.logWarn('Compability check skipped', `No compabitility provided`);
    }

    if (!this.compatible) {
      return this.logWarn(
        'Incompatible',
        `Expected '${this.compatibility.toString()}' but the installed battlecry version is: '${
          this.battlecry.version
        }'`
      );
    }
  }

  logWarn(label: string, message: string) {
    logger.warn(`[${label}] ${this.basename}`);
    logger.addIndentation();
    logger.default(message);
    logger.removeIndentation();
    logger.emptyLine();
  }

  throwMethodNotImplemented(method: string): void {
    throw new Error(`Method ${method} not implemented on generator ${this.constructor.name}`);
  }

  throwMethodNotRegistered(method: string): void {
    throw new Error(
      `Method ${method} is not registered. You can register your command using @command or adding it to config = {}`
    );
  }
}
