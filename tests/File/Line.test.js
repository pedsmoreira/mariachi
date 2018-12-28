import { Line } from 'battlecry';

describe('Line', () => {
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
});
