// @flow

export default function withMethodMissing(Klass: Function) {
  return class extends Klass {
    _methodMissingProxy: Proxy<Klass>;

    constructor(...args: any[]) {
      super(...args);

      const handler = { get: this._handleMethodMissing };
      this._methodMissingProxy = new Proxy(this, handler);

      return this._methodMissingProxy;
    }

    _handleMethodMissing = (target: Object, name: any) => {
      const value = target[name];
      if (value !== undefined) return typeof value === 'function' ? value.bind(target) : value;

      const customMethodMissing = !!target._createMethodMissingFn;
      const fn = (...args: any) => target.__methodMissing__(name, args, this._methodMissingProxy);

      return customMethodMissing ? target._createMethodMissingFn(target, name, fn) : fn;
    };
  };
}
