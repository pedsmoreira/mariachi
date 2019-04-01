import { command } from 'battlecry';

describe('@option', () => {
  describe('without details', () => {
    class TestStrategy {
      @command
      @command.option('path')
      test() {}
    }

    it('registers the option', () => {
      const strategy = new TestStrategy();
      expect(strategy.config).toEqual({
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
  class TestStrategy {
    @command
    @command.option('path', { alias: 'j' })
    test() {}
  }

  it('registers the option with details', () => {
    const strategy = new TestStrategy();
    expect(strategy.config).toEqual({
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
