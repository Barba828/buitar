/**
 * 音符基础配置
 */
import type {
	Note,
	NoteFalling,
	Interval,
	IntervalFalling,
	ModeType,
	DegreeTag,
	IntervalNum,
	NoteAll,
} from '../interface'

/**
 * 音高Interval数组
 */
export const NOTE_LIST: Note[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
export const NOTE_FALLING_LIST: NoteFalling[] = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']
export const INTERVAL_LIST: Interval[] = ['1', '1#', '2', '2#', '3', '4', '4#', '5', '5#', '6', '6#', '7']
export const INTERVAL_FALLING_LIST: IntervalFalling[] = [
	'1',
	'2b',
	'2',
	'3b',
	'3',
	'4',
	'5b',
	'5',
	'6b',
	'6',
	'7b',
	'7',
]
export const DEFAULT_TUNE: Note[] = ['E', 'A', 'D', 'G', 'B', 'E']
export const DEFAULT_ABSOLUTE_TUNE: string[] = ['E2', 'A2', 'D3', 'G3', 'B3', 'E4']
export const DEFAULT_LEVEL = 2
export const NOTE_SORT: Note[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
export const NOTE_SORT_PITCH: number[] = [0, 2, 4, 5, 7, 9, 11]
export const NOTE_MULTI_LIST: NoteAll[][] = [
	['B#', 'C'],
	['C#', 'Db'],
	['D'],
	['D#', 'Eb'],
	['E', 'Fb'],
	['E#', 'F'],
	['F#', 'Gb'],
	['G'],
	['G#', 'Ab'],
	['A'],
	['A#', 'Bb'],
	['B', 'Cb'],
]
export const MODE_LIST: ModeType[] = [
	// 标准七度
	'major', // 中古调式dorian
	'minor', // 中古调式aeolian
	// 中古调式
	'dorian',
	'phrygian',
	'lydian',
	'mixolydian',
	'locrian',
	// 五度
	'major-pentatonic',
	'minor-pentatonic',
	// 布鲁斯
	'major-blues',
	'minor-blues',
]

/**级数罗马数字映射 */
export const DEGREE_TAG_MAP: Record<IntervalNum, DegreeTag> = {
	1: 'Ⅰ',
	2: 'Ⅱ',
	3: 'Ⅲ',
	4: 'Ⅳ',
	5: 'Ⅴ',
	6: 'Ⅵ',
	7: 'Ⅶ',
}

export const DEGREE_TAG_LIST: DegreeTag[] = ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ', 'Ⅵ', 'Ⅶ']

// export const SEMITONES_LENGTH = NOTE_LIST.length

/**
 * 品柱数量，即从 0 ～ 16品
 */
export const GRADE_NUMS = 17
/**
 * 弦数量
 */
export const STRING_NUMS = 6
/**
 * 手指品柱跨度
 */
export const FINGER_GRADE_NUMS = 4
