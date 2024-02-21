import {
	NOTE_LIST,
	NOTE_FALLING_LIST,
	INTERVAL_LIST,
	INTERVAL_FALLING_LIST,
	NOTE_INTERVAL_MAP,
	DEGREE_INTERVAL_MAP,
} from '../config'
import type {
	Tone,
	Note,
	Interval,
	ToneSchema,
	NoteFalling,
	IntervalFalling,
	Pitch,
	NoteBasic,
	IntervalBasic,
} from '../interface'

const NOTE_REGEX = /([A-Ga-g\d#b])/g

// overload
function transNote(x: Tone): Note
function transNote(x: Tone[]): Note[]
/**
 * Tone音字符 => 标准Note字符
 * @param x
 * @returns Note
 */
function transNote(x: Tone | Tone[]) {
	if (x instanceof Array) {
		return x.map((x) => transNote(x as Tone))
	}
	return isNote(x)
		? x
		: isNoteFalling(x)
		? NOTE_LIST[NOTE_FALLING_LIST.indexOf(x)]
		: isInterval(x)
		? NOTE_LIST[INTERVAL_LIST.indexOf(x)]
		: isIntervalNum(x)
		? NOTE_LIST[INTERVAL_LIST.indexOf(x.toString() as Interval)]
		: NOTE_LIST[INTERVAL_FALLING_LIST.indexOf(x as IntervalFalling)]
}

/**
 * Note or NoteIndex => Tone所有类型字符
 * @param note
 * @returns toneSchema
 */
function transToneSchema(note: Note | number): ToneSchema {
	let index = 0
	if (typeof note === 'number') {
		index = note
	} else {
		index = NOTE_LIST.indexOf(note)
	}
	return {
		note: NOTE_LIST[index],
		noteFalling: NOTE_FALLING_LIST[index],
		interval: INTERVAL_LIST[index],
		intervalFalling: INTERVAL_FALLING_LIST[index],
		index,
	}
}

/**
 * 转换为 0 ~ 11 音高「based on C」
 * @param x
 */
function transPitch(x: Tone): Pitch
function transPitch(x: Tone[]): Pitch[]
function transPitch(x: Tone | Tone[]) {
	if (x instanceof Array) {
		return x.map((x) => transPitch(x as Tone))
	}
	let basic = 0
	const [tone, symbol] = String(x).match(NOTE_REGEX) as [NoteBasic | IntervalBasic, string]
	if (Number(tone)) {
		// tone -> 0 ~ 7
		basic = DEGREE_INTERVAL_MAP[tone as IntervalBasic] + 12
	} else {
		// tone -> C ~ B
		basic = NOTE_INTERVAL_MAP[tone as NoteBasic] + 12 // 避免「symbol = b」出现 -1
	}
	if (symbol === '#') {
		basic += 1
	} else if (symbol === 'b') {
		basic -= 1
	}
	basic = basic % 12
	return basic
}

/**
 * Tone音字符变调
 * @param x
 */
function transToneOffset(x: Tone, offset: number = 0) {
	const base = transPitch(x)
	let index = (base + offset) % NOTE_LIST.length
	if (index < 0) {
		index += NOTE_LIST.length
	}
	return NOTE_LIST[index]
}

/**
 * Tone切换关系大小调
 * @param x
 */
function transToneMode(x: Pitch, toMinor: boolean = true) {
	const offset = toMinor ? -3 : 3
	return (x + offset) % 12
}

const isNote = (x: any): x is Note => {
	return NOTE_LIST.includes(x)
}
const isNoteFalling = (x: any): x is NoteFalling => {
	return NOTE_FALLING_LIST.includes(x)
}
const isInterval = (x: any): x is Interval => {
	return INTERVAL_LIST.includes(x)
}
const isIntervalNum = (x: any): x is number => {
	return typeof x === 'number' && x < 12
}
const isIntervalFalling = (x: any): x is IntervalFalling => {
	return INTERVAL_FALLING_LIST.includes(x)
}

export { transToneSchema, transNote, transPitch, transToneOffset, transToneMode }
