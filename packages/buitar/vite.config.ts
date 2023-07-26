import { defineConfig } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'
import { VitePWA as pwa } from 'vite-plugin-pwa'
import { viteStaticCopy as copy } from 'vite-plugin-static-copy'

const baseUrl = '/buitar/'

/**
 * https://cn.vitejs.dev/config/
 */
export default defineConfig({
	plugins: [
		react(),
		copy({
			targets: [
				{
					src: resolve(__dirname, '../tone-player/samples/**/*.mp3'),
					dest: 'assets/samples/',
					rename: (fileName: string, fileExtension: string, fullPath: string) =>
						fullPath.match(/packages\/tone-player\/samples\/(.*)/)[1] ||
						`${fileName}.${fileExtension}`,
				},
			],
		}),
		pwa({
			registerType: 'autoUpdate',
			injectRegister: 'script', // 生成 script 标签注入注册sw
			workbox: {
				clientsClaim: true,
				skipWaiting: true,
				globPatterns: ['**/*.{js,css,html,mp3,ico}'],
			},
			manifest: {
				name: 'Buitar',
				short_name: 'Buitar',
				description: '吉他和弦乐理应用',
				background_color: '#3f4345',
				theme_color: '#3f4345',
				start_url: baseUrl,
				publicPath: baseUrl,
				display: 'standalone',
				orientation: 'portrait',
				icons: [
					...[64, 96, 128, 192, 512].map((size) => ({
						src: `icons/pwa-${size}x${size}.png`,
						sizes: `${size}x${size}`,
						type: 'image/png',
					})),
					...[64, 96, 128, 192, 512].map((size) => ({
						src: `icons/pwa-${size}x${size}.png`,
						sizes: `${size}x${size}`,
						type: 'image/png',
						purpose: 'maskable',
					})),
				],
				shortcuts: [
					{
						name: '和弦库',
						short_name: 'Chord Library',
						url: `${baseUrl}library`,
					},
					{
						name: '和弦编辑',
						short_name: 'Chord Analyzer',
						url: `${baseUrl}analyzer`,
					},
					{
						name: '吉他指型',
						short_name: 'Guitar Tableture',
						url: `${baseUrl}tableture`,
					},
				],
			},
			devOptions: {
				enabled: true,
			},
		}),
	],
	base: baseUrl,
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
		outDir: 'dist',
		minify: true,
	},
	server: {
		port: 8282,
		host: 'localhost',
		open: '/',
	},
})
