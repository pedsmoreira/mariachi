import File from './File';
import withMethodMissing from './withMethodMissing';
import { logger } from '../helpers';

// @ts-ignore
export interface FileCollectionType extends Array<File>, File, FileCollection {
  files: File[];
}

@withMethodMissing
export default class FileCollection {
  // @ts-ignore
  _proxy: Proxy<FileCollection>;

  files: File[];

  constructor(...files: File[]) {
    this.files = files;
  }

  *[Symbol.iterator]() {
    yield* this.files;
  }

  __methodMissing__(name: any, args: any[]) {
    const isArrayProperty = this.files[name] !== undefined;
    return isArrayProperty ? this._callArrayProperty(name, args) : this._callEachInArrayMethod(name, args);
  }

  _callArrayProperty(name: string, args: any[]) {
    return this.files[name](...args);
  }

  _callEachInArrayMethod(name: string, args: any[]) {
    this.files.forEach(file => {
      const fn: Function = file[name];
      if (!fn) throw new Error(`Method ${name} does not exist in File`);

      fn.bind(file)(...args);
    });

    return this._proxy;
  }

  _createMethodMissingFn(target: Object, name: any, defaultFn: Function) {
    const number = parseInt(name, 10);
    const isNumber = !isNaN(number);

    const arrayProperty = this.files[name];
    if (arrayProperty !== undefined && typeof arrayProperty !== 'function') return arrayProperty;

    return !isNumber ? defaultFn : this.files[name];
  }

  logPaths() {
    return this.files.forEach(file => logger.default(file.path));
  }
}
