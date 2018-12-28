import { command } from 'battlecry';

describe('@option', () => {
  describe('without details', () => {
    class TestGenerator {
      @command
      @command.option('path')
      test() {}
    }

    it('registers the option', () => {
      const generator = new TestGenerator();
      expect(generator.config).toEqual({
        test: {
          options: {
            path: {}
          }
        }
      });
    });
  });
});

describe('with details', () => {
  class TestGenerator {
    @command
    @command.option('path', { alias: 'j' })
    test() {}
  }

  it('registers the option with details', () => {
    const generator = new TestGenerator();
    expect(generator.config).toEqual({
      test: {
        options: {
          path: {
            alias: 'j'
          }
        }
      }
    });
  });
});
