// @flow

export default function memoize(target: any, propertyKey: string, descriptor: Object) {
  const originalMethod = descriptor.get;
  let memoizedValue;

  descriptor.get = function() {
    if (!memoizedValue) memoizedValue = originalMethod.apply(this, arguments);
    return memoizedValue;
  };

  return descriptor;
}
