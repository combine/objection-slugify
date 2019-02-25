module.exports = {
  verbose: true,
  rootDir: process.cwd() + '/test',
  setupFilesAfterEnv: [
    '<rootDir>/support/jest.setup.js'
  ]
};
