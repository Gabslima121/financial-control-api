import { pathsToModuleNameMapper } from 'ts-jest';
import { readFileSync } from 'node:fs';

/** @type {import('ts-jest').JestConfigWithTsJest} */
const tsconfig = JSON.parse(readFileSync(new URL('./tsconfig.json', import.meta.url)));

export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.spec.ts', '**/*.spec.ts', '**/*.test.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { useESM: true, tsconfig: 'tsconfig.json' }],
  },
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: tsconfig.compilerOptions?.paths
    ? pathsToModuleNameMapper(tsconfig.compilerOptions.paths, { prefix: '<rootDir>/' })
    : {},
};