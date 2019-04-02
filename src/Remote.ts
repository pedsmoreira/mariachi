import { basename } from 'path';

import File from './File';
import RemoteFile from './File/RemoteFile';
import battleCasex from 'battle-casex';

import { logger, exec, ExecResponse } from './helpers';
import { memoize } from './decorators';

type Props = {
  host: string;
  ip: string;
  username: string;
  privateKey: File | string;
};

export default class Remote {
  name: string;
  ip: string;
  username: string = 'root';
  privateKey: string;
  port: number = 22;

  _readyPromise: Promise<any>;

  constructor(props: Props | 'string') {
    if (typeof props === 'string') {
      this.name = props;
    } else {
      if (props.privateKey instanceof File) props.privateKey = props.privateKey.path;
      Object.assign(this, props);
    }

    RemoteFile._remote = this;
  }

  @memoize
  get privateKeyFile() {
    return new File(this.privateKey);
  }

  /*
   * SSH
   */

  get sshSignature() {
    if (this.name) return this.name;
    return `-p ${this.port} -i ${this.privateKey} ${this.username}@${this.ip}`;
  }

  async scp(srcValue: File | string, destValue: File | string, messageBuilder: Function) {
    const src = srcValue instanceof File ? srcValue.path : srcValue;

    let dest = destValue instanceof File ? destValue.path : destValue;
    if (dest.endsWith('/')) dest += basename(src);

    const messages = messageBuilder(src, dest);

    logger.default(`️☁️  SCP with server ${this.name}`);
    logger.addIndentation();
    logger.default(`🙏 ${messages.initial}`);

    const response = await exec(`scp ${src} ${dest}`);
    if (response.success) logger.default('☀️  ' + messages.success);

    logger.removeIndentation();
    return dest;
  }

  async download(remoteValue: File | string, localValue: File | string): Promise<File> {
    const messageBuilder = (src, dest) => ({
      initial: `Requesting to download file ${src}`,
      success: `File downloaded to ${dest}`
    });

    const dest = await this.scp(`${this.sshSignature}:${remoteValue}`, localValue, messageBuilder);
    return new File(dest);
  }

  async upload(localValue: File | string, remoteValue: File | string): Promise<RemoteFile> {
    const messageBuilder = (src, dest) => ({
      initial: `Requesting to upload file ${src}`,
      success: `File uploaded to ${dest}`
    });

    const dest = await this.scp(localValue, `${this.sshSignature}:${remoteValue}`, messageBuilder);
    return new RemoteFile(this, dest);
  }

  async exec(command: string): Promise<ExecResponse> {
    logger.default(`️☁️  SSHing into server ${this.name}`);
    logger.addIndentation();

    const response = await exec(`ssh ${this.sshSignature} "${command}"`);
    if (response.success) logger.default('☀️  SSH command complete succesfully');

    logger.removeIndentation();
    return response;
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
      `Host ${this.name}`,
      `  HostName ${this.ip}`,
      `  Port ${this.port}`,
      `  User ${this.username}`,
      `  IdentityFile ~/.ssh/${this.name}`,
      ''
    ]);

    file.save();
  }

  /*
   * Logging & Errors
   */

  logLabeledWarn(label: string, message: string) {
    logger.labeledWarn(`Remote ${this.ip}`, label, message);
  }
}
