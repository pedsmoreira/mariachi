import Remote from '../Remote';
import File from './File';
import scp2 from 'scp2';
import { logger } from '../helpers';

export default class RemoteFile extends File {
  remote: Remote;

  _tmpLocal: File;
  static _remote: Remote;

  constructor(remote: Remote, path: string, name?: string) {
    super(path, name);
    this.remote = remote;
  }

  static homedPath(path: string) {
    return path;
  }

  static glob(pattern: string, name?: string | null) {
    logger.warn('.glob not supported on RemoteFile');
    return [];
  }

  static read(path: string) {
    return new RemoteFile(this._remote, path).tmpLocal.text;
  }

  static require(path: string) {
    return require(new RemoteFile(this._remote, path).tmpLocal.path);
  }

  static saveBinary(src: string, path: string) {
    const dest = { ...this._remote.sshConfig, path };

    scp2.scp(src, dest, function(err) {
      console.log('error', err);
    });
  }

  static saveText(path: string, text: string) {
    const file = File.tmp;
    file.text = text;
    file.save();

    this.saveBinary(file.path, path);
  }

  static delete(path: string) {
    this._remote.exec(`rm ${path}`);
  }

  static chmod(path: string, mode: number) {
    this._remote.exec(`chmod ${path} ${mode}`);
  }

  get self() {
    const self: any = this.constructor;
    self._remote = this.remote;
    return self;
  }

  get tmpLocal(): File {
    const tmp = File.tmp;

    const src = { ...this.remote.sshConfig, path: this.path };
    const dest = tmp.path;

    scp2.scp(src, dest, function(err) {
      console.log('error', err);
    });

    return tmp;
  }

  saveLocal(path: string): File {
    return this.tmpLocal.move(path);
  }
}
