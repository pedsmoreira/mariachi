import { Battlecry } from 'battlecry';

describe('Case: Help', () => {
  let battlecry;

  function setupBattlecry() {
    battlecry.load(`${__dirname}/../fixtures/battlecry`);

    battlecry.singleHelp = jest.fn();

    battlecry.strategies.unit = { register: jest.fn() };
    battlecry.strategies.unit.help = jest.fn();
  }

  describe('given a strategy', () => {
    beforeEach(() => {
      battlecry = new Battlecry(['node', 'cry', '--help', 'unit']);
      setupBattlecry();
    });

    it('shows help for the requested strategy', () => {
      battlecry.play();
      expect(battlecry.singleHelp).toHaveBeenCalled();
      expect(battlecry.strategies.unit.help).not.toHaveBeenCalled();
    });
  });

  describe('without a specific strategy', () => {
    beforeEach(() => {
      battlecry = new Battlecry(['node', 'cry', '--help']);
      setupBattlecry();
    });

    it('shows help for all strategies', () => {
      battlecry.play();
      expect(battlecry.singleHelp).not.toHaveBeenCalled();
      expect(battlecry.strategies.unit.help).toHaveBeenCalled();
    });
  });
});
