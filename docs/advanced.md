# Advanced Guides

## [Advanced] Glob Options

By default BattleCry lists all files except for `.DS_Store` _(created on OSX)_.

If you need to provide custom `globOptions`, please refer to the list of options is available on the node-glob _(this is the library used to do globbing on BattleCry)_ repository: https://github.com/isaacs/node-glob#options

## Other exports

Battlecry exports a few internal methods and libraries that it uses.

You can import them in case you need to so something that can't be covered by file or generator helpers.

* Libraries

  * [casex](https://github.com/pedsmoreira/casex)
  * [pluralize](https://github.com/blakeembrey/pluralize)

- Battlecry display helpers
  * [log](https://github.com/pedsmoreira/battlecry/blob/master/src/helpers/log.js)
  * [dd](https://github.com/pedsmoreira/battlecry/blob/master/src/helpers/dd.js)

* Battlecry classes

  * [Battlecry](https://github.com/pedsmoreira/battlecry/blob/master/src/classes/Battlecry.js)
  * [ArgBuilder](https://github.com/pedsmoreira/battlecry/blob/master/src/classes/ArgBuilder.js)
  * [File](https://github.com/pedsmoreira/battlecry/blob/master/src/classes/File.js)
  * [Generator](https://github.com/pedsmoreira/battlecry/blob/master/src/classes/Generator.js)
  * [GeneratorMethod](https://github.com/pedsmoreira/battlecry/blob/master/src/classes/GeneratorMethod.js)
  * [OptionBuilder](https://github.com/pedsmoreira/battlecry/blob/master/src/classes/OptionBuilder.js)
