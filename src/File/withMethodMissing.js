// @flow

export default function withMethodMissing(Klass: Function) {
  return class extends Klass {
    _proxy: Proxy<Klass>;

    constructor(...args: any[]) {
      super(...args);

      this._proxy = new Proxy(this, {
        get: this._handleMethodMissing
      });

      return this._proxy;
    }

    _handleMethodMissing = (target: Object, name: any) => {
      const value = target[name];
      if (value !== undefined) return typeof value === 'function' ? value.bind(target) : value;

      const customMethodMissing = !!target._createMethodMissingFn;
      const fn = (...args: any) => target.__methodMissing__(name, args);

      return customMethodMissing ? target._createMethodMissingFn(target, name, fn) : fn;
    };
  };
}
