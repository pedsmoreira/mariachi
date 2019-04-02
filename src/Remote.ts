import { Client } from 'ssh2';
import File from './File';
import RemoteFile from './File/RemoteFile';
import battleCasex from 'battle-casex';

import { logger } from './helpers';
import { memoize } from './decorators';

type Props = {
  host: string;
  ip: string;
  username: string;
  privateKey: string;
};

type ExecResponse = {
  success: boolean;
  error?: string;
  messages: string[];
  code: number;
};

export default class Remote {
  host: string;
  ip: string;
  username: string;
  privateKey: string;
  port: number = 22;

  _readyPromise: Promise<any>;

  constructor(props: Props | 'string') {
    if (typeof props === 'string') {
      this.host = props;
    } else {
      Object.assign(this, props);
    }

    this._readyPromise = new Promise(resolve => {
      this.sshClient.on('ready', function() {
        console.log('Client :: ready');
        resolve();
      });
    });

    this.connect();
    RemoteFile._remote = this;
  }

  /*
   * Ssh config
   */

  get sshConfig() {
    return {
      host: this.host,
      username: this.username,
      privateKey: this.privateKeyFile.text
    };
  }

  @memoize
  get sshClient() {
    return new Client();
  }

  @memoize
  get privateKeyFile() {
    return new File(this.privateKey);
  }

  /*
   * Connection
   */

  connect(): this {
    this.sshClient.connect({
      port: this.port,
      ...this.sshConfig
    });

    return this;
  }

  async exec(command: string): Promise<ExecResponse> {
    await this._readyPromise;
    logger.addIndentation();

    const result: any = await new Promise(resolve => {
      this.sshClient.exec(command, function(err, stream) {
        if (err) throw err;
        stream
          .on('close', function(code, signal) {
            console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
            resolve();
          })
          .on('data', function(data) {
            console.log('STDOUT: ' + data);
          })
          .stderr.on('data', function(data) {
            console.log('STDERR: ' + data);
          });
      });
    });

    logger.removeIndentation();
    return result;
  }

  /*
   * File management
   */

  async files(pattern: string, name?: string): Promise<RemoteFile[]> {
    const response = await this.exec(`ls ${battleCasex(pattern, name)}`);
    return response.messages.map(path => new RemoteFile(path));
  }

  async file(pattern: string, name?: string): Promise<RemoteFile> {
    const files = await this.files(pattern, name);

    if (!files.length) {
      const path = battleCasex(pattern, name);
      this.logLabeledWarn('File not found', `A new RemoteFile instance was created for path "${path}"`);
      return new RemoteFile(path);
    }

    return this.files[0] || RemoteFile;
  }

  /*
   * Config local
   */

  configLocal() {
    this.configLocalSshKey();
    this.configLocalSshHost();
  }

  configLocalSshKey() {
    this.privateKeyFile.saveAs(`~/.ssh/`).chmod(0o400);
  }

  configLocalSshHost() {
    const file = new File(`~/.ssh/config`);
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
