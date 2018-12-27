import { command } from 'battlecry';

describe('@command', () => {
  describe('without args', () => {
    class TestGenerator {
      @command
      test() {}
    }

    it('registers the command', () => {
      const generator = new TestGenerator();
      expect(generator.config).toEqual({
        test: {}
      });
    });
  });
});

describe('with args', () => {
  class TestGenerator {
    @command('name phone? ...others')
    test() {}
  }

  it('registers the command with args', () => {
    const generator = new TestGenerator();
    expect(generator.config).toEqual({
      test: {
        args: 'name phone? ...others'
      }
    });
  });
});
