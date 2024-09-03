/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
    rootDir: 'tests',
    preset: 'ts-jest',
    testEnvironment: 'node',
    globals: {
        'ts-jest': {
            useESM: true,
        },
    },
};
