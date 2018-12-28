import { command } from 'battlecry';

describe('decorators', () => {
  class TestGenerator {
    @command({ args: 'name phone? ...others', description: 'foo bar' })
    @command.option('test')
    test() {}
  }

  it('registers the command with all decorators', () => {
    const generator = new TestGenerator();
    expect(generator.config).toEqual({
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
