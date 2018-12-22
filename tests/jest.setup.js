// Avoid console output
jest.spyOn(global.console, 'log').mockImplementation(() => jest.fn());
jest.spyOn(global.console, 'error').mockImplementation(() => jest.fn());

// Commander.js calls process.stdout
jest.spyOn(process.stdout, 'write').mockImplementation(() => jest.fn());
