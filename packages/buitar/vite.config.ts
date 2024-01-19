import { defineConfig } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'
import { VitePWA as pwa } from 'vite-plugin-pwa'
import { viteStaticCopy as copy } from 'vite-plugin-static-copy'
import postcssPresetEnv from 'postcss-preset-env'

const baseUrl = process.env.BASE_URL || '/'

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
						fullPath.match(/packages\/tone-player\/samples\/(.*)/)?.[1] ||
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
				globPatterns: ['**/*.{js,css,html,mp3,ogg,ico}'],
				maximumFileSizeToCacheInBytes: 2 * 1024 * 1024, // 2MB，最大预缓存文件大小
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
						short_name: 'Guitar Fingering',
						url: `${baseUrl}fingering`,
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
				additionalData: '@import "src/style/definitions/index.scss";', // 预处理
			},
		},
		postcss: {
			plugins: [postcssPresetEnv()], // css 前缀补全兼容
		},
	},
	build: {
		outDir: 'dist',
		minify: true,
		rollupOptions: {
			output: {
				/**
				 * 手动做一下拆包，避免超过500kb
				 * tone 单独打包，避免 buitar 和 @buitar/tone-player 重复打包
				 * vexflow 整包过大，单独打包 core 和字体 bravura
				 * workspace 包单独打包，和tonejs不同，abcjs 包打在 @buitar/abc-editor 中
				 */
				manualChunks: {
					tone: ['tone'],
					'vexflow/core': ['vexflow/core'],
					'vexflow/bravura': ['vexflow/bravura'],
					'react-libs': ['react', 'react-dom', 'react-router-dom'],
					'@buitar/abc-editor': ['@buitar/abc-editor'],
					'@buitar/to-guitar': ['@buitar/to-guitar'],
					'@buitar/tone-player': ['@buitar/tone-player'],
				},
			},
		},
	},
	server: {
		port: 8282,
		host: '0.0.0.0',
		open: '/',
	},
	optimizeDeps: {
		include: ['react', 'react-dom'],
	},
})
