import { spaces } from 'battlecry';

describe('#spaces', () => {
  describe('given an array', () => {
    it('adds spaces to each line', () => {
      const text = spaces(2, ['one', 'two', 'three']);
      expect(text).toEqual(['  one', '  two', '  three']);
    });
  });

  describe('given a string', () => {
    it('adds spaces to each line', () => {
      const text = spaces(4, 'text');
      expect(text).toEqual('    text');
    });
  });
});
