import { File, Line, LineCollection } from 'battlecry';
import rimraf from 'rimraf';
import { EOL } from 'os';
import fs from 'fs';

const tmpPath = `${__dirname}/File-tmp`;
const fixturesPath = `${__dirname}/../fixtures`;

describe('File', () => {
  let textFile;

  beforeEach(() => {
    textFile = new File('');
    textFile.lines = ['a', 'b', 'c', 'a'];
  });

  afterAll(() => {
    rimraf.sync(tmpPath);
  });

  describe('#existing', () => {
    const file = new File(`${fixturesPath}/a.txt`);

    describe('when the file exists', () => {
      it('returns the file at the given path with its contents', () => {
        const existingFile = file.existing(`${fixturesPath}/b.txt`);
        expect(existingFile.path).toEqual(`${fixturesPath}/b.txt`);
        expect(existingFile.text).toEqual('content on file b');
      });
    });

    describe('when the file does not exist', () => {
      it('returns a file at the requested path and current contents (template)', () => {
        const existingFile = file.existing(`${fixturesPath}/new-file`);
        expect(existingFile.path).toEqual(`${fixturesPath}/new-file`);
        expect(existingFile.text).toEqual('content on file a');
      });
    });
  });

  describe('.glob', () => {
    it('returns file paths', () => {
      const globA = File.glob(`${fixturesPath}/a.*`);
      expect(globA).toHaveLength(1);
      expect(globA[0].filename).toEqual('a.txt');

      const globFirstFolder = File.glob(`${fixturesPath}/*.txt`);
      expect(globFirstFolder).toHaveLength(2);
      expect(globFirstFolder[0].filename).toEqual('a.txt');
      expect(globFirstFolder[1].filename).toEqual('b.txt');

      const globDeep = File.glob(`${fixturesPath}/**/*.txt`);
      expect(globDeep).toHaveLength(3);
      expect(globDeep[0].filename).toEqual('a.txt');
      expect(globDeep[1].filename).toEqual('b.txt');
      expect(globDeep[2].filename).toEqual('c.txt');
    });

    it('does not return folders', () => {
      const globFolder = File.glob(`${fixturesPath}/folder/**`);
      expect(globFolder).toHaveLength(1);
      expect(globFolder[0].filename).toEqual('c.txt');
    });
  });

  /*
   * File management
   */

  describe('#binary', () => {
    it('returns true for binary files', () => {
      expect(new File(`${fixturesPath}/binary`).binary).toBeTruthy();
    });

    it('returns false for text files', () => {
      expect(new File(`${fixturesPath}/a.txt`).binary).toBeFalsy();
    });

    it('returns false for files that do not exist', () => {
      expect(new File('123456.7890').binary).toBeFalsy();
    });

    it('returns false for .log files', () => {
      expect(new File(`${fixturesPath}/some-log.log`).binary).toBeFalsy();
    });
  });

  describe('#exists', () => {
    it('returns true if file exists', () => {
      expect(new File(`${fixturesPath}/a.txt`).exists).toBeTruthy();
    });

    it('returns false if file does not exist', () => {
      expect(new File(`file-that-does-not-exist`).exists).toBeFalsy();
    });
  });

  describe('#name', () => {
    it('returns file name without', () => {
      expect(new File(`some-folder/a.txt`).name).toEqual('a');
    });
  });

  describe('#filename', () => {
    it('returns file name with extension', () => {
      expect(new File(`some-folder/a.txt`).filename).toEqual('a.txt');
    });
  });

  describe('#dirnmame', () => {
    it('returns file directory', () => {
      expect(new File(`some-folder/a.txt`).dirname).toEqual('some-folder');
    });
  });

  describe('#extension', () => {
    it('returns file extension', () => {
      expect(new File(`some-folder/a.txt`).extension).toEqual('.txt');
    });
  });

  describe('#save', () => {
    it('calls saveAs with file path and name', () => {
      const file = new File('path/__naMe__', 'test-name');
      file.saveAs = jest.fn();

      file.save();
      expect(file.saveAs).toHaveBeenCalledWith('path/testName');
    });
  });

  describe('#saveAs', () => {
    it('saves existing file with new content', () => {
      const path = `${tmpPath}/save-existing.txt`;

      const firstFile = new File(path);
      firstFile.text = '123';
      firstFile.save();

      const secondFile = new File(path);
      expect(secondFile.text).toEqual('123');
      secondFile.text = 'abc';
      secondFile.save();

      expect(new File(path).text).toEqual('abc');
    });

    it('saves new file with content', () => {
      const path = `${tmpPath}/save-new.txt`;

      const file = new File(path);
      expect(file.exists).toBeFalsy;

      file.text = 'abc';
      file.save();
      expect(new File(path).text).toEqual('abc');
    });

    it('applies battle-casex to file path', () => {
      const path = `${tmpPath}/save-__na-me__.txt`;
      const realPath = `${tmpPath}/save-with-cool-name.txt`;

      const file = new File(path, 'withCoolName');
      file.save();

      expect(new File(path).exists).toBeFalsy();
      expect(new File(realPath).exists).toBeTruthy();
    });

    it('create necessary directories to save file', () => {
      expect(fs.existsSync(`${tmpPath}/a/`)).toBeFalsy();

      const path = `${tmpPath}/a/b/c/file.txt`;
      new File(path).save();

      expect(fs.existsSync(`${tmpPath}/a/b/c/`)).toBeTruthy();
      expect(new File(path).exists).toBeTruthy();
    });

    it('saves binary files', () => {
      const path = `${tmpPath}/binary-__na-me__`;
      const realPath = `${tmpPath}/binary-saved-as`;

      new File(`${fixturesPath}/binary`).saveAs(path, 'saved-as');
      expect(new File(realPath).exists).toBeTruthy();
    });

    it('appends the filename if the given path ends with /', () => {
      const path = `${tmpPath}/binary-folder-__na-me__/`;
      const realPath = `${tmpPath}/binary-folder-saved-as/binary`;

      new File(`${fixturesPath}/binary`).saveAs(path, 'saved-as');
      expect(new File(realPath).exists).toBeTruthy();
    });
  });

  describe('#move', () => {
    it('moves the file', () => {
      const path = `${tmpPath}/file-to-be-moved.txt`;
      const file = new File(path).save();

      const newPath = `${tmpPath}/moved-__name__.txt`;
      const realNewPath = `${tmpPath}/moved-abc.txt`;
      file.move(newPath, 'abc');

      expect(new File(realNewPath).exists).toBeTruthy();
      expect(new File(path).exists).toBeFalsy();
    });
  });

  describe('#delete', () => {
    it('deletes the file', () => {
      const path = `${tmpPath}/file-to-be-deleted.txt`;

      const file = new File(path).save();
      expect(file.exists).toBeTruthy();
      file.delete();

      expect(new File(path).exists).toBeFalsy();
    });
  });

  /*
   * Text Helpers
   */

  describe('#read', () => {
    describe('file exists', () => {
      it('sets text from file', () => {
        const file = new File(`${fixturesPath}/a.txt`);
        file.read();
        expect(file.text).toEqual('content on file a');
      });
    });

    describe('file does no exist', () => {
      it('assigns an empty string to text', () => {
        const file = new File(`file-that-does-not-exist.txt`);
        file.read();
        expect(file.text).toEqual('');
      });
    });
  });

  describe('#text', () => {
    it('throws an error if the file is a binary', () => {
      const file = new File(`${fixturesPath}/binary`);
      expect(() => file.text).toThrowError();
    });

    it('returns existing text', () => {
      const file = new File();
      file.lines = ['first', 'second'];
      expect(file.text).toEqual(`first${EOL}second`);
    });
  });

  describe('#text=', () => {
    it('sets lines', () => {
      textFile.text = `one\ntwo`;
      expect(textFile.textArray).toEqual(['one', 'two']);
    });

    it('works with \r\n and \n', () => {
      textFile.text = 'a\nb\r\nc';
      expect(textFile.textArray).toEqual(['a', 'b', 'c']);
    });
  });

  describe('#line', () => {
    it('returns the line at a given index', () => {
      expect(textFile.line(1).text).toEqual('b');
    });

    it('returns null if the line does not exist', () => {
      expect(textFile.line(10)).toBeUndefined();
    });
  });

  describe('#lines', () => {
    it('returns lines', () => {
      textFile.lines = ['one', 'two'];
      expect(textFile.textArray).toEqual(['one', 'two']);
    });

    it('returns an empty array if text is empty', () => {
      const file = new File('');
      expect(file.text);
    });
  });

  describe('#find', () => {
    it('returns first matching occurrence', () => {
      expect(textFile.find('a').index).toBe(0);
      expect(textFile.find('b').index).toBe(1);
    });

    it('returns stub when nothing is found', () => {
      expect(() => textFile.find('text-not-in-file').stub).toBeTruthy();
    });
  });

  describe('#last', () => {
    it('returns last matching line', () => {
      expect(textFile.last('a').index).toBe(3);
      expect(textFile.last('b').index).toBe(1);
    });

    it('returns stub when nothing is found', () => {
      expect(() => textFile.last('text-not-in-file').stub).toBeTruthy();
    });
  });

  describe('#all', () => {
    describe('given a search', () => {
      it('returns all matching lines', () => {
        expect(textFile.all('a').length).toBe(2);
      });
    });

    describe('given no search', () => {
      it('returns all lines', () => {
        expect(textFile.all().length).toBe(4);
      });
    });
  });

  describe('#consecutive', () => {
    it('returns all matching lines', () => {
      textFile.lines = ['start', 'import a', 'import b', 'import c', 'end'];
      expect(textFile.consecutive('import ').textArray).toEqual(['import a', 'import b', 'import c']);
    });
  });

  describe('#add', () => {
    it('returns a collection with new lines', () => {
      const response = textFile.add(1, ['new 1', 'new 2']);
      expect(response).toBeInstanceOf(LineCollection);
      expect(response.length).toBe(2);
    });

    it('works with a single string', () => {
      const response = textFile.add(1, 'new 1');
      expect(response).toBeInstanceOf(LineCollection);
      expect(response.length).toBe(1);
    });

    describe('given texts', () => {
      it('adds lines at given index', () => {
        textFile.add(1, ['new 1', 'new 2']);
        expect(textFile.textArray).toEqual(['a', 'new 1', 'new 2', 'b', 'c', 'a']);
      });
    });

    describe('given lines', () => {
      it('adds lines at given index', () => {
        textFile.add(1, [new Line(textFile, 'new 1')]);
        expect(textFile.textArray).toEqual(['a', 'new 1', 'b', 'c', 'a']);
      });
    });
  });

  describe('#prepend', () => {
    it('adds line at the beginning', () => {
      textFile.prepend('new line');
      expect(textFile.textArray).toEqual(['new line', 'a', 'b', 'c', 'a']);
    });
  });

  describe('#append', () => {
    it('adds line at the end', () => {
      textFile.append('new line');
      expect(textFile.textArray).toEqual(['a', 'b', 'c', 'a', 'new line']);
    });
  });

  describe('#remove', () => {
    describe('given a number', () => {
      it('removes the line', () => {
        textFile.remove(1);
        expect(textFile.textArray).toEqual(['a', 'c', 'a']);
      });
    });

    describe('given a line', () => {
      it('removes the line', () => {
        textFile.remove(textFile.lines.first);
        expect(textFile.textArray).toEqual(['b', 'c', 'a']);
      });
    });
  });
});
