import { NOTE_LIST, NOTE_FALLING_LIST, INTERVAL_LIST, INTERVAL_FALLING_LIST } from '../config'
import type { Tone, Note, Interval, ToneSchema, NoteFalling, IntervalFalling, ToneTypeName, Pitch } from '../interface'

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

// overload
function transTone(note: Note): ToneSchema
function transTone(note: number): ToneSchema
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
function transToneNum(x: Tone): Pitch
function transToneNum(x: Tone[]): Pitch[]
/**
 * Tone音字符 => 相对音高 （0～11）
 * @param x
 * @returns Pitch
 */
function transToneNum(x: Tone | Tone[]) {
	if (x instanceof Array) {
		return x.map((x) => transToneNum(x as Tone))
	}
	const note  = transNote(x)
	return NOTE_LIST.indexOf(note)
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

export { transTone, transNote, transToneNum }
