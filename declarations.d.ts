interface Window {
	Tone: any
}

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

/**
 * React类型
 */
declare type SetState<T> = React.Dispatch<React.SetStateAction<T>>
declare type Dispatch<T> = React.Dispatch<{
	type: 'set' | 'init' | 'reset'
	payload: T
}>
/**
 * 推断函数入参类型
 */
declare type GetType<T> = T extends (arg: infer P) => void ? P : string
