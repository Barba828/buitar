/**
 * 样式模块
 */
declare module '*.module.scss'

/**
 * 图片模块
 */
declare module '*.svg'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.gif'
declare module '*.bmp'
declare module '*.tiff'

/**
 * 音频模块
 */
declare module '*.ogg'
declare module '*.mp3'
declare module '*.wav'

declare type SetState<T> = React.Dispatch<React.SetStateAction<T>>

declare type Dispatch<T> = React.Dispatch<{
	type: 'set' | 'init' | 'reset'
	payload: T
}>
