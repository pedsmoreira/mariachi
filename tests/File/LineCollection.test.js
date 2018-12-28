import { File, Line, LineCollection } from 'battlecry';

describe('LineCollection', () => {
  let collection;

  beforeEach(() => {
    const file = new File();
    file.lines = ['a', 'b', 'c'];

    collection = file.lines;
  });

  describe('behaves as an array', () => {
    it('returns the expected value through []', () => {
      expect(collection[0]).toBeInstanceOf(Line);
      expect(collection[0].text).toEqual('a');
    });
  });

  describe('#methodMissing', () => {
    it('call children methods with given arguments', () => {
      collection.prepend('--');
      const texts = collection.lines.map(line => line.text);
      expect(texts).toEqual(['--a', '--b', '--c']);
    });

    it('returns itself for chaining', () => {
      expect(collection.prepend('--') === collection).toBeTruthy;
    });
  });
});
