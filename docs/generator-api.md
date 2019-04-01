# Strategy API

## Configuring your methods

Each strategy must have a `config` variable defining all BattleCry methods.

```js
config = {
  options?: {
    [name: string]: {
      description: string,
      arg?: 'required' | 'optional', // An option may receive an argument
      alias?: string // Defaults to the first letter of the option name
    }
  },
  args?: string, // name ...surnames?
  description?: string
}
```

## File helpers

* `files(pattern: string, name?: ?string, globOptions?: Object): File[]`: Get files that match `pattern`
* `file(pattern: string, name?: ?string, globOptions?: Object): File`: Get first file that matches `pattern`
* `delete(path: string, name?: string): void`: Delete a file or directory

- `templates(pattern?: string, globOptions?: Object): File[]`: Get files inside the strategy's `templates/` subdirectory
- `template(pattern?: string, globOptions?: Object): File`: Get first file that matches the pattern

As you may have noticed, most of these methods return one or an array of File(s). For more details about the `File` class API, please check the [File API](#File API) section below.

_Note: BattleCry performs all IO operations synchronously_

## Helpers to call other strategies

There may be cases when you may want to call multiple strategies from one strategies. BattleCry provides nice helpers for you to accomplish that in you `Strategy` class.

* `strategy(name: string): Strategy`: Get a new strategy instance by name
* `setArgs(args: Object): this`: Setup strategy arguments to be consumed when `play` is called
* `setOptions(options: Object): this`: Setup strategy options to be consumed when `play` is called
* `play(methodName: string)`: Play a strategy method

## Executing command line directly

In some cases you may wanna call command lines directly.

* `exec(command: string): string | Buffer`: Execute command line
