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
    it('replaces all __name__ pattern occurrences', () => {
      const line = new Line(null, '__name__ _Name_s');
      expect(line.name('foo').text).toEqual('foo Foos');
    });
  });

  describe('#replace', () => {
    describe('given a string', () => {
      it('replaces the first occurrence', () => {
        const line = new Line(null, 'John Doe and Maria Doe');
        expect(line.replace('Doe', 'Smith').text).toEqual('John Smith and Maria Doe');
      });
    });

    describe('given a regex', () => {
      it('replaces according to the regex', () => {
        const line = new Line(null, 'John Doe and Maria Doe');
        expect(line.replace(/Doe/g, 'Smith').text).toEqual('John Smith and Maria Smith');
      });
    });
  });

  describe('#before', () => {
    it('adds line before the current one', () => {
      textFile.lines.last.before('new');
      expect(textFile.textArray).toEqual(['a', 'b', 'c', 'new', 'a']);
    });
  });

  describe('#after', () => {
    it('adds line after the current one', () => {
      textFile.lines.first.after('new');
      expect(textFile.textArray).toEqual(['a', 'new', 'b', 'c', 'a']);
    });
  });

  describe('#until', () => {
    describe('given a number', () => {
      it('creates a collection from this line until the given index', () => {
        const lines = textFile.lines[1].until(2);
        expect(lines.textArray).toEqual(['b', 'c']);
      });
    });

    describe('given a line', () => {
      it('creates a collection from this line until the given one', () => {
        const lines = textFile.lines[1].until(2);
        expect(lines.textArray).toEqual(['b', 'c']);
      });
    });

    describe('given a function', () => {
      it('creates a collection from this line until the first match', () => {
        const lines = textFile.lines[0].until(line => line.text === 'c');
        expect(lines.textArray).toEqual(['a', 'b', 'c']);
      });
    });

    describe('given a previous line', () => {
      it('returns the collection', () => {
        const lines = textFile.lines[2].until(1);
        expect(lines.textArray).toEqual(['b', 'c']);
      });
    });
  });

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
