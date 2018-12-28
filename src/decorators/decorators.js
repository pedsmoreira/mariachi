// @flow

function config(target: Object, key: string) {
  if (!target.config) target.config = {};
  if (!target.config[key]) target.config[key] = {};

  return target.config[key];
}

export function command(targetOrProperties: any, methodName: string, descriptor: PropertyDescriptor<*>) {
  // @command - without params
  if (methodName) {
    config(targetOrProperties, methodName);
    return descriptor;
  }

  // @command('name') - with params
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

command.option = option;
