import Remote from '../Remote';
import File from './File';

export default class RemoteFile extends File {
  remote: Remote;

  _tmpFile: string;

  static homedPath(path: string) {
    return path;
  }

  static read(path: string) {
    return '';
  }

  static saveBinary(src: string, dest: string) {}

  static saveText(path: string, text: string) {}

  static delete(path: string) {}

  static chmod(path: string) {}

  saveLocal(path: string): File {
    // scp
    // @ts-ignore
    return null;
  }
}
