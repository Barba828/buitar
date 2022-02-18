export * as Color from '../style/config.js'

// /**
//  * 音高Interval数组
//  */
// export const INTERVAL_LIST: Interval[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
// export const INTERVAL_FALLING_LIST: IntervalFalling[] = ['C', 'bD', 'D', 'bE', 'E', 'F', 'bG', 'G', 'bA', 'A', 'bB', 'B']
// export const Note_LIST: Note[] = ['1', '1#', '2', '2#', '3', '4', '4#', '5', '5#', '6', '6#', '7']
// export const Note_FALLING_LIST: NoteFalling[] = ['1', 'b2', '2', 'b3', '3', '4', 'b5', '5', 'b6', '6', 'b7', '7']
// export const DEFAULT_TUNE: Interval[] = ['E', 'A', 'D', 'G', 'B', 'E']

export let rate = 2
/**
 * 指板高度
 */
export const SINGLE_HEIGHT = 30 * rate
/**
 * 指板宽度
 */
export const SINGLE_WIDTH = 20 * rate
/**
 * 指板内边距（左右上下）
 */
export const PADDING = SINGLE_WIDTH
/**
 * 品丝厚度
 */
export const GRADE_LINE_WIDTH = 2 * rate

// /**
//  * 品柱数量
//  */
// export const GRADE_NUMS = 16
// /**
//  * 弦数量
//  */
// export const STRING_NUMS = 6
