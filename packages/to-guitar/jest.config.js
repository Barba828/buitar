/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */

const path = require('path')

module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	rootDir: path.join(__dirname, '.'),
	moduleNameMapper: {
		// '@/(.*)$': '<rootDir>/src/$1',
	},
}
