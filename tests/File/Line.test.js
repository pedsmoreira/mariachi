import { File, Line } from 'battlecry';

describe('Line', () => {
  let textFile;

  beforeEach(() => {
    textFile = new File('');
    textFile.lines = ['a', 'b', 'c', 'a'];
  });

  describe('#index', () => {
    it('returns the current line index', () => {
      expect(textFile.lines[1].index).toBe(1);
    });
  });

  describe('#name', () => {
    it('replaces all __name__ pattern occurrences', () => {});
  });

  describe('#replace', () => {
    describe('given a string', () => {});

    describe('given a regex', () => {});
  });

  describe('#before', () => {});

  describe('#after', () => {});

  describe('#until', () => {});

  describe('#untilLast', () => {});

  describe('#untilEnclosing', () => {});

  describe('#prepend', () => {});

  describe('#leftPad', () => {});

  describe('#laftUnpad', () => {});

  describe('#append', () => {});

  describe('#rightPad', () => {});

  describe('#rightUnpad', () => {});

  describe('#first', () => {});

  describe('#last', () => {});

  describe('#previous', () => {});

  describe('#next', () => {});

  describe('#allNext', () => {});

  describe('#up', () => {});

  describe('#down', () => {});

  describe('#move', () => {});

  describe('#enclosing', () => {});

  describe('#indentation', () => {
    it('returns empty when there is no indentation', () => {
      expect(new Line(null, '').indentation).toEqual('');
      expect(new Line(null, 'foo-bar').indentation).toEqual('');
    });

    it('detects white spaces', () => {
      expect(new Line(null, '  foo-bar').indentation).toEqual('  ');
    });

    it('detects tabs', () => {
      expect(new Line(null, '\tfoo-bar').indentation).toEqual('\t');
    });
  });

  describe('#remove', () => {});
});
