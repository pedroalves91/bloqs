module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/*.spec.ts'], // Ensure Jest picks up spec files
    transform: {
        '^.+\\.ts?$': ['ts-jest', { tsconfig: 'tsconfig.test.json' }], // NEW syntax
    },
    moduleFileExtensions: ['ts', 'js', 'json'],
    setupFiles: ['<rootDir>/jest.setup.ts'],
};
