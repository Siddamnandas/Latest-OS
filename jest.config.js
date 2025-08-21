module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootdir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootdir>/src/$1',
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: '<rootdir>/tsconfig.json' }],
  },
};