import Path from './Path';
const homedir = require('os').homedir();

export default class Directory {
  static glob(pattern: string, name?: string | null, options?: Object) {
    return Path.glob(pattern, name, options).filteredMap(path => {
      return new Directory(path);
    });
  }
}
