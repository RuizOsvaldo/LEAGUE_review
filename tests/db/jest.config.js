const path = require('path');
const serverRoot = path.resolve(__dirname, '../../server');

/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  rootDir: '.',
  testMatch: ['**/*.test.ts'],
  moduleDirectories: ['node_modules', path.join(serverRoot, 'node_modules')],
  transform: {
    '^.+\\.tsx?$': [
      path.join(serverRoot, 'node_modules/ts-jest'),
      {
        tsconfig: path.join(serverRoot, 'tsconfig.test.json'),
        diagnostics: { ignoreCodes: ['TS2307'] },
      },
    ],
  },
};
