import { command } from 'battlecry';

describe('decorators', () => {
  class TestStrategy {
    @command({ args: 'name phone? ...others', description: 'foo bar' })
    @command.option('test')
    test() {}
  }

  it('registers the command with all decorators', () => {
    const strategy = new TestStrategy();
    expect(strategy.config).toEqual({
      test: {
        args: 'name phone? ...others',
        description: 'foo bar',
        options: {
          test: {}
        }
      }
    });
  });
});
