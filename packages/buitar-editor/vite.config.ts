import { defineConfig } from 'vite'

const baseUrl = process.env.BASE_URL || '/'

/**
 * https://cn.vitejs.dev/config/
 */
export default defineConfig({
	plugins: [],
	base: baseUrl,
	resolve: {
		extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
		alias: [{ find: '@/', replacement: '/src/' }],
	},
	build: {
		outDir: 'dist',
		minify: true,
	},
	server: {
		port: 8283,
		host: '0.0.0.0',
		open: '/',
	}
})
