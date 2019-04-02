import { exec as childProcessExec } from 'child_process';
import { basename } from 'path';
import logger from './logger';
import File from '../File';

export type ExecOptions = {
  path?: string;
  privateKey?: string;
};

export type ExecResponse = {
  success: boolean;
  error?: string;
  messages: string[];
  code: number;
};

export default async function exec(command: string, options: ExecOptions = {}): Promise<ExecResponse> {
  let logMessage = `🏃 Exec command: \`${command}\``;

  if (options.privateKey) {
    logMessage += ` with private key "${basename(options.privateKey)}"`;
    command = `ssh-agent $(ssh-add ${options.privateKey}; ${command})`;
  }

  if (options.path) {
    logMessage += ` in path "${options.path}"`;
    command = `cd ${options.path}; ${command}`;
  }

  logger.action(logMessage);
  logger.addIndentation();

  const response: any = await new Promise(resolve => {
    const childProcess = childProcessExec(command);
    let success = true;
    const messages = [];
    let error;

    childProcess.stdout.on('data', function(data) {
      const lines = data
        .toString()
        .split(File.EOL)
        .filter(line => line.trim());

      messages.push(...lines);
      lines.forEach(line => logger.default(line));
    });

    childProcess.stderr.on('data', function(data) {
      const lines = data
        .toString()
        .split(File.EOL)
        .filter(line => line.trim());

      error = lines.join(File.EOL);

      lines.forEach(line => logger.error(line));
      success = false;
    });

    childProcess.on('exit', function(code) {
      logger[success ? 'success' : 'error']('🔚 Exec exited with status code ' + code.toString());

      const response: ExecResponse = { success, code, error, messages };
      resolve(response);
    });
  });

  logger.removeIndentation();
  return response;
}
