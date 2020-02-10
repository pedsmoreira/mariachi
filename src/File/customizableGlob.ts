import nodeGlob from 'glob';

export const defaultGlobOptions = {
  dot: true,
  ignore: ['**/.DS_Store']
};

export default function(pattern: string, options: Object = {}) {
  return nodeGlob.sync(pattern, { ...defaultGlobOptions, ...options });
}
