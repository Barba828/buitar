import typescript from '@rollup/plugin-typescript'
import dts from 'rollup-plugin-dts'
import pkg from './package.json'

// 为了将引入的 npm 包，也打包进最终结果中
import resolve from 'rollup-plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

// 一段自定义的内容，以下内容会添加到打包结果中
const footer = `
if(typeof window !== 'undefined') {
  window._Dry_VERSION_ = '${pkg.version}'
}`

export default [
	{
		input: './src/index.ts',
		output: [
			{
				file: './lib/index.esm.js',
				format: 'esm',
				footer,
				sourcemap: true,
			},
		],
		plugins: [typescript(), commonjs(), resolve()],
	},
	{
		input: ['./src/index.ts'],
		output: [{ file: 'lib/index.d.ts', format: 'esm' }],
		plugins: [dts()],
	},
]
