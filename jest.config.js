module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/src/index.ts',
  ],
  globals: {
    'ts-jest': {
      packageJson: 'package.json',
    },
  },
  testRegex: '/test/.*.test.(js|ts)?$',
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/**/*.{ts,js}', '!src/**/*.d.ts', '!dist/**/*'],
};
