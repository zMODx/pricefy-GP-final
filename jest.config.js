/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'node',
  testMatch: ['**/*.test.js'],
  verbose: true,
  testTimeout: 30000, // 30 seconds timeout for tests that involve server startup
  setupFilesAfterEnv: [],
  collectCoverage: true,
  collectCoverageFrom: [
    'server/**/*.js',
    '!server/scripts/**',
    '!server/tests/**',
    '!**/node_modules/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'clover'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.next/'
  ]
};

module.exports = config;
