import { indentation } from 'battlecry';

describe('indentation', () => {
  it('returns empty when there is no indentation', () => {
    expect(indentation('')).toEqual('');
    expect(indentation('foo-bar')).toEqual('');
  });

  it('detects white spaces', () => {
    expect(indentation('  foo-bar')).toEqual('  ');
  });

  it('detects tabs', () => {
    expect(indentation('\tfoo-bar')).toEqual('\t');
  });
});
