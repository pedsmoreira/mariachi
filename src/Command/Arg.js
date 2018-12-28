// @flow

export default class Arg {
  name: string;
  optional: boolean;
  variadic: boolean;

  constructor(text: string) {
    this.name = text.replace(/[.?]/g, '');
    this.optional = text.includes('?');
    this.variadic = text.includes('...');
  }

  get commanderSignature() {
    let response = this.name;

    if (this.variadic) response += '...';
    response = this.optional ? `[${response}]` : `<${response}>`;

    return response;
  }
}
