export type NoteBasic = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B'
export type Note = NoteBasic | 'C#' | 'D#' | 'F#' | 'G#' | 'A#'
export type NoteFalling = NoteBasic | 'Db' | 'Eb' | 'Gb' | 'Ab' | 'Bb'
type NoteExtended = 'Cb' | 'E#' | 'Fb' | 'B#'
export type IntervalBasic = '1' | '2' | '3' | '4' | '5' | '6' | '7'
export type IntervalNum = 1 | 2 | 3 | 4 | 5 | 6 | 7
export type Interval = IntervalBasic | '1#' | '2#' | '4#' | '5#' | '6#'
export type IntervalFalling = IntervalBasic | '2b' | '3b' | '5b' | '6b' | '7b'
type IntervalExtended =
	| '1b'
	| '4b'
	| '3#'
	| '7#'
	| '8'
	| '8#'
	| '9b'
	| '9'
	| '9#'
	| '10b'
	| '10'
	| '11'
	| '11#'
	| '12b'
	| '12'
	| '12#'
	| '13b'
	| '13'
	| '13#'
	| '14b'
	| '14'
export type IntervalAll = Interval | IntervalFalling | IntervalExtended | IntervalNum
export type NoteAll = Note | NoteFalling | NoteExtended
/**
 * 音符类型
 */
export type Tone = NoteAll | IntervalAll
/**
 * 音符类型ToneType名称
 */
export type ToneTypeName = 'note' | 'noteFalling' | 'interval' | 'intervalFalling'
/**
 * 音符Schema
 */
export type ToneSchema = {
	/**
	 * 音名 升调
	 * Note #
	 */
	note: Note
	/**
	 * 音名 降调
	 * Note b
	 */
	noteFalling: NoteFalling
	/**
	 * 音程 升调
	 * Interval #
	 */
	interval: Interval
	/**
	 * 音程 降调
	 * Interval b
	 */
	intervalFalling: IntervalFalling
	/**
	 * 下标
	 */
	index?: number
	/**
	 * 八度高度
	 * C4
	 */
	level?: number
}
/**
 * 数字音高 0 ～ *
 */
export type Pitch = number

/**
 * 指板音符位置
 */
export type Point = {
	/**
	 * 相对音高
	 * Tone: relative 0～11
	 */
	tone: Pitch
	/**
	 * 绝对音高
	 * Pitch: absolute 0～∞
	 */
	pitch: Pitch
	/**
	 * 音名，如「C」「Eb」
	 */
	note: NoteAll
	/**
	 * 是否调内音
	 */
	isInner: boolean
	/**
	 * 音高级数，如「3」
	 * 匹配note音高，如「C3」
	 */
	level: number
	/**
	 * 弦位 1弦开始
	 * string position
	 */
	string: number
	/**
	 * 品位 0品开始
	 * grade position
	 */
	grade: number
	/**
	 * 指位唯一下标
	 */
	index: number
	/**
	 * 扩展属性
	 */
	// [key: string]: any
}
/**
 * 吉他某弦指板音符位置
 */
export type GuitarString = Point[]
/**
 * 吉他全指板指板音符位置
 */
export type GuitarBoard = GuitarString[]
/**
 * 吉他指板位置
 */
export type BoardPosition = Pick<Point, 'grade' | 'string'>
