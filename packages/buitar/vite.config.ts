import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

console.log('lnz', process.env);
/**
 * https://cn.vitejs.dev/config/
 */
export default defineConfig({
	plugins: [react()],
	base: '/buitar/',
	resolve: {
		extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
		alias: [{ find: '@/', replacement: '/src/' }],
	},
	css: {
		modules: {
			generateScopedName: '[local]__[hash:base64:4]', // [name] 模块名
		},
		preprocessorOptions: {
			scss: {
				additionalData: '@import "src/style/app.scss";',
			},
		},
	},
	build: {
		outDir: 'build',
		minify: 'terser', // boolean | 'terser' | 'esbuild'
	},
	server: {
		port: 8282,
		host: 'localhost',
		open: '/',
	},
})
