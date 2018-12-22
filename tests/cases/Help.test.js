import { Battlecry } from 'battlecry';

describe('Case: Help', () => {
  let battlecry;

  function setupBattlecry() {
    battlecry.load(`${__dirname}/../fixtures/battlecry`);
    battlecry.singleHelp = jest.fn();
    battlecry.generators.unit.help = jest.fn();
  }

  describe('given a generator', () => {
    beforeEach(() => {
      battlecry = new Battlecry(['node', 'cry', '--help', 'unit']);
      setupBattlecry();
    });

    it('shows help for the requested generator', () => {
      battlecry.play();
      expect(battlecry.generators.unit.help).not.toHaveBeenCalled();
      expect(battlecry.singleHelp).toHaveBeenCalled();
    });
  });

  describe('without a specific generator', () => {
    beforeEach(() => {
      battlecry = new Battlecry(['node', 'cry', '--help']);
      setupBattlecry();
    });

    it('shows help for all generators', () => {
      battlecry.play();
      expect(battlecry.generators.unit.help).toHaveBeenCalled();
      expect(battlecry.singleHelp).not.toHaveBeenCalled();
    });
  });
});
