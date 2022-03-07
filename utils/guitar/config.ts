export * from './config-chord.js'

/**
 * 音高Interval数组
 */
 export const NOTE_LIST: Note[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
 export const NOTE_FALLING_LIST: NoteFalling[] = ['C', 'bD', 'D', 'bE', 'E', 'F', 'bG', 'G', 'bA', 'A', 'bB', 'B']
 export const INTERVAL_LIST: Interval[] = ['1', '1#', '2', '2#', '3', '4', '4#', '5', '5#', '6', '6#', '7']
 export const INTERVAL_FALLING_LIST: IntervalFalling[] = ['1', 'b2', '2', 'b3', '3', '4', 'b5', '5', 'b6', '6', 'b7', '7']
 export const DEFAULT_TUNE: Note[] = ['E', 'A', 'D', 'G', 'B', 'E']

/**
 * 品柱数量
 */
export const GRADE_NUMS = 16
/**
 * 弦数量
 */
export const STRING_NUMS = 6
/**
 * 手指品柱跨度
 */
export const FINGER_GRADE_NUMS = 4