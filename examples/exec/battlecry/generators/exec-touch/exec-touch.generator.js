import { Strategy, File } from 'battlecry';

export default class ExecTouchStrategy extends Strategy {
  config = {
    generate: {
      args: 'name'
    }
  };

  generate() {
    const file = new File('it-worked/exec-touchs/__na-me__.txt', this.args.name).save();
    this.exec(`chmod 777 ${file.path}`);
  }
}
