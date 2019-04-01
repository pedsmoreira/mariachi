// @flow

import { Client } from 'ssh2';
import RemoteFile from './RemoteFile';

export default class Remote {
  host: string;
  username: string;
  privateKey: string;
  port: number = 22;

  _sshClient: any;

  constructor(props: Props | 'string') {
    if (typeof props === 'string') {
      this.host = props;
    } else {
      this.host = props.host;
      this.username = props.username;
      this.privateKey = props.privateKey;
    }

    this.connect();
  }

  get sshClient() {
    if (!this._sshClient) {
      this._sshClient = new Client();
    }

    return this._sshClient;
  }

  get privateKeyFile() {
    return new File(this.privateKey);
  }

  files(pattern: string, name?: string) {
    return RemoteFile.glob(pattern, name);
  }

  connect(): this {
    this.sshClient.connect({
      host: this.host,
      port: this.port,
      username: this.username,
      privateKey: this.privateKeyFile.text
    });

    return this;
  }

  exec(command: string) {
    return this.sshClient.exec(command);
  }

  configLocal() {}

  configSshKey() {
    this.file(this.args.path)
      .saveAs(`~/.ssh/`)
      .chmod(400);
  }

  configSsshHost() {
    const file = this.file(`~/.ssh/config`);
    file.append([
      `Host peerfect-web-${this.args.name}`,
      `  HostName ${this.ip}`,
      `  IdentityFile ~/.ssh/peerfect-web-${this.args.name}`,
      '  User root',
      ''
    ]);

    file.save();
  }
}
