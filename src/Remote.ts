import { Client } from 'ssh2';
import File from './File';
import RemoteFile from './File/RemoteFile';
import battleCasex from 'battle-casex';

import { logger } from './helpers';

type Props = {
  host: string;
  ip: string;
  username: string;
  privateKey: string;
};

export default class Remote {
  host: string;
  ip: string;
  username: string;
  privateKey: string;
  port: number = 22;

  _sshClient: any;

  constructor(props: Props | 'string') {
    if (typeof props === 'string') {
      this.host = props;
    } else {
      Object.assign(this, props);
    }

    this.connect();
    RemoteFile._remote = this;
  }

  get sshConfig() {
    return {
      host: this.host,
      username: this.username,
      privateKey: this.privateKeyFile.text
    };
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

  glob(pattern: string, name?: string | null): RemoteFile[] {
    const response = this.exec(`ls ${battleCasex(pattern, name)}`);
    return response.messages.map(path => new RemoteFile(path));
  }

  files(pattern: string, name?: string): RemoteFile[] {
    return this.glob(pattern, name);
  }

  file(pattern: string, name?: string): RemoteFile {
    const files = this.files(pattern, name);

    if (!files.length) {
      const path = battleCasex(pattern, name);
      this.logLabeledWarn('File not found', `A new RemoteFile instance was created for path "${path}"`);
      return new RemoteFile(path);
    }

    return this.files[0] || RemoteFile;
  }

  connect(): this {
    this.sshClient.connect({
      port: this.port,
      ...this.sshConfig
    });

    return this;
  }

  exec(command: string) {
    return this.sshClient.exec(command);
  }

  configLocal() {
    this.configSshKey();
    this.configSshHost();
  }

  configSshKey() {
    this.privateKeyFile.saveAs(`~/.ssh/`).chmod(0o400);
  }

  configSshHost() {
    const file = this.file(`~/.ssh/config`);
    file.append([
      `Host ${this.host}`,
      `  HostName ${this.ip}`,
      `  Port ${this.port}`,
      `  User ${this.username}`,
      `  IdentityFile ~/.ssh/${this.host}`,
      ''
    ]);

    file.save();
  }

  /*
   * Logging & Errors
   */

  logLabeledWarn(label: string, message: string) {
    logger.labeledWarn(`Remote ${this.host}`, label, message);
  }
}
