// Avoid console output
jest.spyOn(global.console, 'log').mockImplementation(() => jest.fn());
jest.spyOn(global.console, 'error').mockImplementation(() => jest.fn());
jest.spyOn(process.stdout, 'write').mockImplementation(() => jest.fn());
