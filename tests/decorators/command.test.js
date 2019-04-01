import { command, description } from 'battlecry';

describe('@command', () => {
  describe('without args', () => {
    class TestStrategy {
      @command
      test() {}
    }

    it('registers the command', () => {
      const strategy = new TestStrategy();
      expect(strategy.config).toEqual({
        test: {}
      });
    });
  });
});

describe('with args', () => {
  class TestStrategy {
    @command({ args: 'name phone? ...others', description: 'Foo bar' })
    test() {}
  }

  it('registers the command with args', () => {
    const strategy = new TestStrategy();
    expect(strategy.config).toEqual({
      test: {
        args: 'name phone? ...others',
        description: 'Foo bar'
      }
    });
  });
});
