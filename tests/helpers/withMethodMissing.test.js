import { withMethodMissing } from 'battlecry';

@withMethodMissing
class Test {
  methodMissing() {
    console.log('missing!');
  }
}

describe('@withMethodMissing', () => {
  it('works', () => {
    const instance = new Test();
    instance.hello();
  });
});
