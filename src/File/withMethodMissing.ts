function withMethodMissingFn(Klass: any) {
  return class extends Klass {
    // @ts-ignore
    _proxy: Proxy<Klass>;

    constructor(...args: any[]) {
      super(...args);

      this._proxy = new Proxy(this, {
        get: this._handleMethodMissing
      });

      return this._proxy;
    }

    _handleMethodMissing = (target: any, name: any) => {
      const value = target[name];
      if (value !== undefined) return typeof value === 'function' ? value.bind(target) : value;

      const customMethodMissing = !!target._createMethodMissingFn;
      const fn = (...args: any) => target.__methodMissing__(name, args);

      return customMethodMissing ? target._createMethodMissingFn(target, name, fn) : fn;
    };
  };
}

const withMethodMissing: any = withMethodMissingFn;
export default withMethodMissing;
