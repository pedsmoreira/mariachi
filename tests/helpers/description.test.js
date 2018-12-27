import { command, description } from 'battlecry';

describe('@description', () => {
  describe('with no args', () => {
    class TestGenerator {
      @command
      @description('foo bar')
      test() {}
    }

    it('adds description to command', () => {
      const generator = new TestGenerator();
      expect(generator.config).toEqual({
        test: {
          description: 'foo bar'
        }
      });
    });
  });
});
