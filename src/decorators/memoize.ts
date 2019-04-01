export default function memoize(target: any, methodName: string, descriptor: PropertyDescriptor) {
  const originalMethod: any = descriptor.get;
  let memoizedValue;

  descriptor.get = function() {
    if (!memoizedValue) memoizedValue = originalMethod.apply(this, arguments);
    return memoizedValue;
  };

  return descriptor;
}
