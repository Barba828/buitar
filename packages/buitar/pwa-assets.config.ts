import {
	Preset,
	defineConfig,
	createAppleSplashScreens,
} from '@vite-pwa/assets-generator/config'

/**
 * 插件生成icons
 * 在线网站 https://progressier.com/pwa-icons-and-ios-splash-screen-generator 开屏图
 */
export const iconSizes = [64, 96, 128, 192, 512]
export const appleIconSizes = [180]

const minimalPreset: Preset = {
	transparent: {
		sizes: iconSizes,
		padding: 0,
		favicons: [[192, 'favicon.ico']],
	},
	maskable: {
		sizes: iconSizes,
		padding: 0,
		//   resizeOptions: {
		//     background:'#3f4345'
		//   }
	},
	apple: {
		sizes: appleIconSizes,
		padding: 0,
	},
	// assetName: (type: AssetType, size: ResolvedAssetSize) => defaultAssetName(type, size),

	appleSplashScreens: createAppleSplashScreens(
		{
			padding: 0.3,
			linkMediaOptions: {
				log: true,
				addMediaScreen: true,
				basePath: '/',
				xhtml: true,
			},
			resizeOptions: {
				background: 'rgb(63, 67, 69)',
				width: 200,
				height: 200,
			}
			// name: (landscape, size, dark) => {
			// 	return `apple-splash-${landscape ? 'landscape' : 'portrait'}-${
			// 		typeof dark === 'boolean' ? (dark ? 'dark-' : 'light-') : ''
			// 	}${size.width}x${size.height}.png`
			// },
		},
		['iPad Air 9.7"', 'iPhone 14 Pro']
	),
}

export default defineConfig({
	preset: minimalPreset,
	images: ['public/icons/logo.png'],
})
