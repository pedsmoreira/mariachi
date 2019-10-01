import { File, Line, LineCollection } from 'battlecry';

describe('LineCollection', () => {
  let file: File;
  let collection: LineCollection;

  beforeEach(() => {
    file = new File();
    file.lines = ['a', 'b', 'c'];

    collection = new LineCollection(...file.lines);
  });

  describe('#first', () => {
    it('returns first line', () => {
      expect(collection.first.text).toEqual('a');
    });
  });

  describe('#last', () => {
    it('returns last line', () => {
      expect(collection.last.text).toEqual('c');
    });
  });

  describe('#dive', () => {
    it('removes the first and last lines', () => {
      expect(collection.dive().textArray).toEqual(['b']);
    });
  });

  describe('#surface', () => {
    it('adds previous and next line', () => {
      collection = collection.dive();
      expect(collection.surface().textArray).toEqual(['a', 'b', 'c']);
    });
  });

  describe('#add', () => {
    it('adds response from function to lines sorted by index', () => {
      collection.add(() => file.add(1, 'foo'));
      expect(collection.textArray).toEqual(['a', 'foo', 'b', 'c']);
    });
  });

  describe('#sort', () => {
    it('sorts the lines and updates their index on the file', () => {
      collection.add(() => file.prepend('d')).sort();
      expect(file.textArray).toEqual(['a', 'b', 'c', 'd']);
    });
  });

  describe('trailing', () => {
    it('adds rightPad to all lines except the last', () => {
      collection.trailing(',');
      expect(collection.textArray).toEqual(['a,', 'b,', 'c']);
    });
  });

  describe('behaves as an array', () => {
    it('returns the expected value through []', () => {
      expect(collection[0]).toBeInstanceOf(Line);
      expect(collection[0].text).toEqual('a');
      expect(collection.length).toBe(3);
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
