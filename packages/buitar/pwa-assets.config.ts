import { Preset, defineConfig } from '@vite-pwa/assets-generator/config'

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
}

export default defineConfig({
	preset: minimalPreset,
	images: ['public/icons/logo.png'],
})
