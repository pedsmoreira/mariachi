import battleCasex from 'battle-casex';
import customizableGlob from './customizableGlob';
const homedir = require('os').homedir();

export default class Path {
  static resolve(path: string, name?: string) {
    if (!path) path = '';
    if (path.startsWith('~')) path = homedir + path.substring(1);

    return name ? battleCasex(path, name) : path;
  }

  static glob(path: string, name?: string | null, options?: Object): string[] {
    return customizableGlob(this.resolve(path, name), options);
  }
}
