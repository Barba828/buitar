import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
	build: {
		lib: {
			entry: './lib/index.tsx',
			name: '@buitar/svg-chord',
		},
		rollupOptions: {
			external: ['react', 'react-dom'], // 将 react 和 react-dom 设置为外部依赖项
			output: {
				globals: {
					react: 'React',
					'react-dom': 'ReactDOM',
				},
			},
		},
	},
	plugins: [
		dts({
			entryRoot: './lib',
		}),
	],
})
