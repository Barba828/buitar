import typescript from '@rollup/plugin-typescript'
import dts from 'rollup-plugin-dts'

import resolve from 'rollup-plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import copy from 'rollup-plugin-copy'

export default [
	{
		input: 'index.ts',
		output: [
			{
				file: './dist/index.esm.js',
				format: 'esm',
				sourcemap: true,
			},
		],
		plugins: [
			typescript(),
			commonjs(),
			resolve(),
			copy({
				targets: [{ src: 'samples/*', dest: 'dist/samples' }],
			}),
		],
	},
	{
		input: ['index.ts'],
		output: [{ file: 'dist/index.d.ts', format: 'esm' }],
		plugins: [dts()],
	},
]
