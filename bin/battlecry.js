#!/usr/bin/env node

require('./registerBabel');

try {
  // battlecry is not linked yet for this file on Windows
  const Battlecry = require(`${__dirname}/../src`).Battlecry;
  const battlecry = new Battlecry(process.argv);

  battlecry.load(`${__dirname}/../battlecry`);
  battlecry.load(`${process.cwd()}/battlecry`);

  battlecry.play();
} catch (error) {
  const dd = require(`${__dirname}/../src/index.ts`).dd;
  dd(error);
}
