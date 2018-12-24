// @flow

export default function withMethodMissing(Klass: Function) {
  return class extends Klass {
    constructor(...args: Array<any>) {
      super(...args);

      const handler = { get: this._handleMethodMissing };

      return new Proxy(this, handler);
    }

    _handleMethodMissing(target: Object, name: string) {
      const method = target[name];
      if (method) return method.bind(target);

      return (...args: any) => target.methodMissing(name, args);
    }
  };
}
