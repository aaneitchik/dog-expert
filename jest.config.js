module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '\\.css$': require.resolve('./test/style-mock.ts'),
  },
  collectCoverageFrom: ['**/src/**/*.{ts,tsx}'],
  coverageThreshold: {
    global: {
      statements: 0,
      branches: 0,
      functions: 0,
      lines: 0,
    },
    './src/utils': {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100,
    },
  },
};
