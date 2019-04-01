const { dirname } = require('path');
const fs = require('fs');
const babelRc = JSON.parse(fs.readFileSync(`${__dirname}/../.babelrc`, 'utf8'));

function ignore(filename) {
  // Fix for paths on Windows
  filename = filename.replace(/\\(\\?)/g, '/');
  if (filename.includes(`battlecry/node_modules/`)) return true;

  const inNodeModules = filename.includes('node_modules/');
  const inBattlecryFolder = filename.includes('battlecry/');
  return inNodeModules && !inBattlecryFolder;
}

function buildModule(type, value) {
  let [name, options] = Array.isArray(value) ? value : [value];
  if (!name.startsWith('@')) name = `babel-${type}-${name}`;

  if (name === 'babel-plugin-module-resolver') {
    options.root = [`${process.cwd()}/battlecry`];
    options.alias.battlecry = `${__dirname}/..`;
  }

  const path = dirname(require.resolve(`${name}/package.json`));
  return options ? [path, options] : path;
}

function buildPresets() {
  return babelRc.presets.map(preset => buildModule('preset', preset));
}

function buildPlugins() {
  return babelRc.plugins.map(plugin => buildModule('plugin', plugin));
}

require('@babel/register')({
  babelrc: false,
  ignore: [ignore],
  presets: buildPresets(),
  plugins: buildPlugins()
});
