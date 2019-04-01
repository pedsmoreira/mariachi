function config(target: any, key: string) {
  const klass = target.constructor;

  if (!klass.decoratedConfig) klass.decoratedConfig = {};
  klass.decoratedConfig[key] = {};

  return klass.decoratedConfig[key];
}

function commandFn(targetOrProperties: any, methodName: string, descriptor: PropertyDescriptor) {
  // @command - without params
  if (methodName) {
    config(targetOrProperties, methodName);
    return descriptor;
  }

  // @command({ name: 'name' }) - with params
  return (target: any, methodName: string, descriptor: any) => {
    Object.assign(config(target, methodName), targetOrProperties);
    return descriptor;
  };
}

export function option(name: any, details: Object = {}) {
  return (target: any, methodName: string, descriptor: any) => {
    const methodConfig = config(target, methodName);
    if (!methodConfig.options) methodConfig.options = {};
    methodConfig.options[name] = details;

    return descriptor;
  };
}

const command: any = commandFn;
command.option = option;

export { command };
