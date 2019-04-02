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
  username: string = 'root';
  privateKey: string;
  port: number = 22;

  _readyPromise: Promise<any>;

  constructor(props: Props | 'string') {
    if (typeof props === 'string') {
      this.host = props;
    } else {
      Object.assign(this, props);
    }

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
    const client = new Client();

    this._readyPromise = new Promise(resolve => {
      client.on('ready', function() {
        console.log('Client :: ready');
        resolve();
      });
    });

    client.connect({
      port: this.port,
      ...this.sshConfig
    });

    return client;
  }

  @memoize
  get privateKeyFile() {
    return new File(this.privateKey);
  }

  /*
   * Connection
   */

  async exec(command: string): Promise<ExecResponse> {
    if (!this._readyPromise) this.sshClient; // Initiate client
    await this._readyPromise;

    logger.addIndentation();

    const result: any = await new Promise(resolve => {
      this.sshClient.exec(command, function(err, stream) {
        if (err) throw err;
        stream
          .on('close', function(code, signal) {
            console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
            resolve({});
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
    return response.messages.map(path => new RemoteFile(this, path));
  }

  async file(pattern: string, name?: string): Promise<RemoteFile> {
    const files = await this.files(pattern, name);

    if (!files.length) {
      const path = battleCasex(pattern, name);
      this.logLabeledWarn('File not found', `A new RemoteFile instance was created for path "${path}"`);
      return new RemoteFile(this, path);
    }

    return this.files[0] || RemoteFile;
  }

  async saveFile(file: File, path: string): Promise<File> {
    if (path.endsWith('/')) path += file.filename;

    await RemoteFile.saveBinary(file.path, path);
    return new RemoteFile(this, path);
  }

  /*
   * Config local
   */

  configLocal() {
    this.configLocalSshKey();
    this.configLocalSshHost();
  }

  configLocalSshKey() {
    this.privateKeyFile.saveAs(`~/.ssh/`);
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
