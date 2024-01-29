import { NOTE_LIST, NOTE_FALLING_LIST, INTERVAL_LIST, INTERVAL_FALLING_LIST } from '../config'
import type {
	Tone,
	Note,
	NoteAll,
	Interval,
	ToneSchema,
	NoteFalling,
	IntervalFalling,
	Pitch,
	ModeType,
NoteBasic,
} from '../interface'

const NOTE_REGEX = /([A-Ga-g#b])/g;

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
		: NOTE_LIST[INTERVAL_FALLING_LIST.indexOf(x)]
}

/**
 * Note or NoteIndex => Tone所有类型字符
 * @param note
 * @returns toneSchema
 */
function transTone(note: Note | number): ToneSchema {
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

// overload
function transNotePitch(x: Tone): Pitch
function transNotePitch(x: Tone[]): Pitch[]
/**
 * Tone音字符 => 相对音高 （0～11）
 * @param x
 * @returns Pitch
 */
function transNotePitch(x: Tone | Tone[]) {
	if (x instanceof Array) {
		return x.map((x) => transNotePitch(x as Tone))
	}
	const note = transNote(x)
	return NOTE_LIST.indexOf(note)
}

function transNoteAllPitch(x: NoteAll): Pitch
function transNoteAllPitch(x: NoteAll[]): Pitch[]
function transNoteAllPitch(x: NoteAll | NoteAll[]) {
	if (x instanceof Array) {
		return x.map((x) => transNoteAllPitch(x as NoteAll))
	}
	const [note, symbol] = x.match(NOTE_REGEX) as [NoteBasic, string];
	let basic = NOTE_LIST.indexOf(note) + 12 // 避免出现 -1
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
	const base = transNotePitch(x)
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
function transToneMode(x: Tone, toMinor: boolean = true) {
	const note = transToneOffset(x, toMinor ? -3 : 3)
	return {
		tone: transTone(note),
		mode: toMinor ? 'minor' : ('major' as ModeType),
	}
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

export { transTone, transNote, transNotePitch, transNoteAllPitch, transToneOffset, transToneMode }
