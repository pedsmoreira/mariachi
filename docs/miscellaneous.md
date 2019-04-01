# Miscellaneous

## Sharing helpers across strategies

It's not uncommon to have multiple strategies share similar helpers. To facilitate you doing that, you can include files from your BattleCry directory directly, without navigating with `..`.

If you have a `testHelper.js` file under `BattleCry/helpers/testHelper.js` for instance, you could include it as:

```javascript
import testHelper from 'helpers/testHelper';
```

## Downloading strategies

You may not have to write all your strategies yourself. BattleCry comes with a handy tool for downloading strategies from GitHub.

```
cry download strategy owner/path
```

If you want to a service provider other then GitHub, please check the [download-git-repo examples](https://github.com/flipxfx/download-git-repo#examples)

### Selecting directory to download from

BattleCry looks for a `battlecry/` folder in the repository root. If none is found it defaults to the repository root. You may also set a custom directory to start BattleCry's search with `--dir`.

```
cry download strategy owner/path --dir test-battlecry
```
