export default {
  moduleFileExtensions: ['js', 'ts', 'mts'],
  extensionsToTreatAsEsm: ['.ts', '.mts'],
  roots: ['<rootDir>/tests'],
  testMatch: ['**/?(*.)+(spec|test).+(ts|tsx|js|mts|mjs)'],
  /*transform: {
      '^.+\\.(ts|tsx|mts)$': 'ts-jest',
  }*/
};
