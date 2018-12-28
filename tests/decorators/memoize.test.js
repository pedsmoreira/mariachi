import { memoize } from 'battlecry';

class Test {
  counter = 0;

  @memoize
  get count() {
    return ++this.counter;
  }
}

describe('memoize', () => {
  it('only calls function once', () => {
    const instance = new Test();

    expect(instance.count).toEqual(1);
    expect(instance.count).toEqual(1);
  });
});
