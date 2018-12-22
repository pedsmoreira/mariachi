import { Battlecry } from 'battlecry';

describe('Case: About', () => {
  it('calls the about method to show a nice output', () => {
    const battlecry = new Battlecry(['node', 'cry', '--about']);
    battlecry.about = jest.fn();

    battlecry.play();
    expect(battlecry.about).toHaveBeenCalled();
  });
});
