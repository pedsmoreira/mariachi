export default class RemoteFile extends File {
  remote: Remote;

  _tmpFile: string;

  constructor() {}

  static homedPath(path: string) {
    return path;
  }

  static glob() {}

  static read() {}

  static delete() {}

  static chmod() {}

  saveAs() {}

  saveLocal(): File {}
}
