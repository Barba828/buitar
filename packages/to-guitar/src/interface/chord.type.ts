import type { IntervalAll, Note, Point, ToneSchema } from './tone.type'

export type ChordType = {
	/**
	 * 和弦标记
	 * dim|aug|...
	 */
	tag: string
	/**
	 * 和弦名称
	 * major triad|...
	 */
	name: string
	/**
	 * 中文和弦名称
	 */
	name_zh: string
	/**
	 * 和弦组成音
	 */
	constitute?: IntervalAll[]
	/**
	 * 和弦根音名
	 * C|D|...
	 */
	tone?: ToneSchema
	/**
	 * 转位和弦 即实际和弦名称over/note
	 * C/E ("C over E")
	 */
	over?: ToneSchema
}
/**
 * 和弦级数
 */
export type DegreeTag = 'Ⅰ' | 'Ⅱ' | 'Ⅲ' | 'Ⅳ' | 'Ⅴ' | 'Ⅵ' | 'Ⅶ'
export type RollType = 'Do' | 'Di' | 'Ra' | 'Re' | 'Mi' | 'Fa' | 'Fi' | 'Se' | 'So' | 'Si' | 'Le' | 'La' | 'Li' | 'Te' | 'Ti' //现代唱名系统对于升降调的区分
export type ChordDegreeNum = 3 | 7 | 9
/**
 * 'dorian', 'phrygian', 'lydian', 'mixolydian', 'aeolian', 'locrian'
 * https://learningmusic.ableton.com/zh-Hans/advanced-topics/modes.html
 */
export type ModeType = 'major' | 'minor' | 'ionian' |'dorian' | 'phrygian' | 'lydian' | 'mixolydian' | 'aeolian' | 'locrian' | 'major-pentatonic' | 'minor-pentatonic'| 'major-blues' | 'minor-blues'
export type DegreeType = {
	/**
	 * 音程
	 * 距离I级和弦音程
	 */
	interval: number
	/**
	 * 级数
	 * 数字标记
	 */
	degreeNum: number
	/**
	 * 级数类型
	 */
	scale: string
	/**
	 * 唱名
	 */
	roll: RollType
}

/**级数和弦 */
export type Chord = {
	degree: DegreeType
	tone: ToneSchema
	chord: Note[]
	chordType: ChordType[]
}

/**指板和弦 */
export type BoardChord = {
	chordType: ChordType
	chordTaps: Point[]
}
