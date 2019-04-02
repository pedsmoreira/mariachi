import * as fs from 'fs';
import tmp from 'tmp';
import downloadGitRepo from 'download-git-repo';
import { join } from 'path';

// @ts-ignore
import { logger, File } from 'battlecry';

export default class GitDownload {
  repository: string;
  dir: string | null;
  tmpPath: string;

  constructor(repository: string, dir: string | null) {
    this.repository = repository;
    this.dir = dir;
    this.tmpPath = tmp.tmpNameSync();
  }

  async handle() {
    return new Promise((resolve, reject) => {
      logger.success(`☁️ Downloading ${this.repository} repository`);
      downloadGitRepo(this.repository, this.tmpPath, err => {
        if (err) return reject(err);

        this.copyStrategies();
        resolve();
      });
    });
  }

  get path(): string {
    if (!this.dir) return this.tmpPath;
    return join(this.tmpPath, this.dir);
  }

  get battlecryPath(): string {
    return `${this.path}/battlecry`;
  }

  get hasBattlecry(): boolean {
    return fs.existsSync(this.battlecryPath) && fs.lstatSync(this.battlecryPath).isDirectory();
  }

  copyStrategies(): void {
    this.logBattlecryFolderGuessed();
    this.logCopyingPath();

    logger.addIndentation();

    const globPath = this.hasBattlecry ? this.battlecryPath : this.path;
    File.glob(join(globPath, '**')).forEach(file => {
      const newPath = join('battlecry', file.path.substring(globPath.length));
      file.saveAs(newPath);
    });

    logger.removeIndentation();
  }

  logBattlecryFolderGuessed() {
    if (this.hasBattlecry) logger.success('🧠 Found a battlecry/ folder at the selected directory');
  }

  logCopyingPath() {
    let logPath = '';
    if (this.dir) logPath = join(logPath, this.dir);
    if (this.hasBattlecry) logPath = join(logPath, 'battlecry');
    if (!logPath.endsWith('/')) logPath += '/';

    logger.action(`📋 Copying all files from repository dir: ${logPath}`);
  }
}
