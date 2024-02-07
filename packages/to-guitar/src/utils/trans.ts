import {
	NOTE_LIST,
	chordMap,
	degreeMap,
	chordDegreeMap,
	DEGREE_TAG_MAP,
	intervalMap,
	NOTE_SORT,
	NOTE_MULTI_LIST,
	NOTE_FALLING_LIST,
	chordTagMap,
} from '../config'
import type {
	Note,
	Tone,
	ChordType,
	ChordDegreeNum,
	ModeType,
	DegreeChord,
	IntervalNum,
	IntervalAll,
	DegreeScale,
	NoteAll,
	DegreeType,
	Pitch,
} from '../interface'
import { transNote, transPitch, transToneSchema } from './trans-tone'

// /**
//  * 和弦音 => 和弦名称[]
//  * @param chords
//  */
// const getChordType = (chords: Note[]): ChordType[] => {
// 	const tone = transToneSchema(chords[0])
// 	const chordList: ChordType[] = []

// 	// 遍历和弦音中每个音当根音当情况（cover转位和弦）
// 	chords.forEach((chord, index) => {
// 		// 根音偏移
// 		const offset = NOTE_LIST.indexOf(chord)
// 		const rest = [...chords]
// 		rest.splice(index, 1)
// 		// 放置根音并对后面的音进行排序（设置offset便于排序，即排序结果根音恒在数组首位）
// 		const intervals = [chord, ...rest]
// 			.map((item) =>
// 				NOTE_LIST.indexOf(item) - offset >= 0
// 					? NOTE_LIST.indexOf(item) - offset
// 					: NOTE_LIST.indexOf(item) - offset + NOTE_LIST.length
// 			)
// 			.sort((a, b) => a - b)

// 		// 排序完成根据音程计算key
// 		const key = intervals.reduce((pre, cur, curIndex) => pre * 10 + (cur - intervals[curIndex - 1] || 0), 0)

// 		const chordItem = chordMap.get(key)
// 		if (chordItem) {
// 			chordList.push({
// 				key,
// 				tone,
// 				over: transToneSchema(NOTE_LIST[offset]),
// 				...chordItem,
// 			})
// 		}
// 	})
// 	return chordList
// }

/**
 * 数字级数 => 罗马级数
 * @param degree
 * @returns
 */
const toDegreeTag = (degree: string | number) => {
	const numStr = degree.toString().match(/\d+/g)?.[0]
	if (!numStr) {
		return ''
	}
	let num = Number(numStr)
	if (num > 7) {
		num = num % 7
	}
	return DEGREE_TAG_MAP[num as IntervalNum]
}

/**
 * 度数 => 半音程
 * 2# 大二度 => 3
 * 5b 减五度 => 6
 * 11 完全十一度 => 17
 * @param interval
 */
const intervalToSemitones = (interval: IntervalAll | Number) => {
	const match = interval.toString().match(/(\d+)(\D*)/)
	if (!match) {
		return 0
	}
	const pitchNum = Number(match[1]) // 总度数
	const semitonesTag = match[2] // 半音标记

	const size = Math.floor(pitchNum / 8) // 差多少个八度
	const intervalNum = pitchNum - size * 7 // 有效度数
	const halfPicth = semitonesTag === '#' ? 1 : semitonesTag === 'b' ? -1 : 0

	const basePitch = intervalMap.get(intervalNum as IntervalNum) || 0
	return size * 12 + basePitch + halfPicth
}

/**
 * 和弦根音 => 和弦
 * @param tone 根音
 * @param chordTypeTag 和弦类型标记（'m'|'aug'|'dim'|...）
 * @returns
 */
const rootToChord = (tone: Tone, chordTypeTag: string = '') => {
	const chordTypeItem = chordTagMap.get(chordTypeTag)
	if (!chordTypeItem) {
		return null
	}

	const intervals = [transPitch(tone)]
	chordTypeItem.key
		.toString()
		.split('')
		.map((item) => parseInt(item))
		.reduce((preNum, curNum) => {
			const tempPitch = (preNum + curNum) % 12
			intervals.push(tempPitch)
			return tempPitch
		}, intervals[0])

	return {
		chord: intervals,
		chordType: chordTypeItem,
	}
}

/**
 * 和弦Tone音名 => 和弦Pitch音 => 和弦名称 & 类型[]
 * @param chords 和弦音数组
 * @param calGrades 升降半音「品」数 默认不变调
 */
const toneToChordType = (chords: Tone[], calGrades?: number) => {
	let chordPitchs = Array.from(new Set(transPitch(chords)))

	if (calGrades) {
		chordPitchs = chordPitchs.map((pitch) => (pitch + calGrades) % 12)
	}

	return pitchToChordType(chordPitchs)
}

/**
 * 和弦Pitch音 => 和弦名称 & 类型[]
 * @param chords
 */
const pitchToChordType = (chords: Pitch[]): ChordType[] => {
	const chordList: ChordType[] = []

	chords = Array.from(new Set(chords))
	// 遍历和弦音中每个音当根音当情况（cover转位和弦）
	chords.forEach((chord, index) => {
		// 重组数组，当前音放在数组首位，作为根音
		const currChords = [...chords]
		currChords.splice(index, 1)
		currChords.unshift(chord)
		// 对后面的音进行排序获取key（要求后面的音高必须比根音高，所以需要 + 12）
		const intervals = currChords
			.map((item) => (item - chord >= 0 ? item - chord : item - chord + 12))
			.sort((a, b) => a - b)

		// 排序完成根据音程计算key
		const key = intervals.reduce((pre, cur, curIndex) => pre * 10 + (cur - intervals[curIndex - 1] || 0), 0)

		const chordItem = chordMap.get(key)
		if (chordItem) {
			chordList.push({
				key,
				tone: chords[0] % 12,
				over: chord % 12,
				...chordItem,
			})
		}
	})
	return chordList
}

/**
 * 调式 & 调 => 顺阶音
 * @param {
 *  @attr mode 调式 默认「major自然大调」
 *  @attr scale 大调音阶 默认「C调」
 * }
 * @example
 * { mode: 'major', scale: 'C'} => [C, D, E, F, G, A, B]
 * { mode: 'major', scale: 'D#'} => [Eb, F, G, Ab, Bb, C, D]
 * @returns 大调音阶顺阶音调 数组
 */
const scaleToDegree = ({ mode = 'major', scale = 'C' }: { mode?: ModeType; scale?: NoteAll }): DegreeType[] => {
	const pitch = transPitch(scale)
	const degreeArr = degreeMap.get(mode)
	const scaleNoteList: DegreeType[] = []
	const sortOffset = NOTE_SORT.findIndex((sortNote) => scale.includes(sortNote))

	// 无效调式 或 无效音名
	if (!degreeArr || sortOffset === -1) {
		return []
	}
	for (let i = 0; i < degreeArr.length; i++) {
		const degree = degreeArr[i]
		const currPitch = (pitch + degree.interval) % 12 // 当前「相对音高」
		const currMultiNode = NOTE_MULTI_LIST[currPitch] // 当前符合「相对音高」的所有音名（包括所有升降号）
		const currSortNote = NOTE_SORT[(i + sortOffset) % 7] // 当前音名（无升降号）
		const currNote = currMultiNode.find((note) => note.includes(currSortNote)) // 当前音名
		if (currNote) {
			scaleNoteList.push({
				...degree,
				note: currNote,
			})
		} else {
			// 存在不符合「相对音高」的音名，例如「D#大调」的7度音是C双升「Cx」
			// 转为「相对音高」的其他音名组成：「D#大调」=>「Eb大调」
			const otherScale = NOTE_MULTI_LIST[pitch].find((note) => note !== scale)
			return scaleToDegree({ mode, scale: otherScale })
		}
	}
	return scaleNoteList
}

/**
 * 调式 & 调 => 顺阶音 & 级数 & 顺阶和弦
 * @param {
 *  @attr mode 调式 默认「major自然大调」
 *  @attr scale 大调音阶 默认「C调」
 *  @attr chordNumType 和弦类型 默认「3和弦」
 * }
 * @example
 * { mode: 'major', scale: 'C'} => [C, D, E, F, G, A, B]
 * { mode: 'major', scale: 'D#'} => [Eb, F, G, Ab, Bb, C, D]
 * @returns 大调音阶顺阶音调 数组
 */
const scaleToDegreeWithChord = ({
	mode = 'major',
	scale = 'C',
	chordNumType = 3,
	degrees,
}: {
	mode?: ModeType
	scale?: NoteAll
	degrees?: DegreeType[]
	chordNumType?: ChordDegreeNum
}) => {
	const scaleDegrees = degrees || scaleToDegree({ mode, scale })
	const chordScale = chordDegreeMap.get(chordNumType)?.interval || [] // 顺阶和弦级数增量

	// 根据转换的大调获取大调和弦
	return scaleDegrees.map((degree, index) => {
		const chordDegreeArr = chordScale.map((scale) => scaleDegrees[(index + scale - 1) % 7])
		const chordType = pitchToChordType(chordDegreeArr.map((degree) => degree.interval))
		return {
			...degree,
			chord: chordDegreeArr,
			chordType,
		} as DegreeChord
	})
}

/**
 * 根据级数获取完整 12 音名「based on C」
 * @param degrees
 */
const degreesToNotes = (degrees: DegreeType[]) => {
	if (!degrees[0].note) {
		return {
			notes: [],
			notesOnC: [],
			notesInnerOnC: [],
		}
	}

	// 1. 获取12音名「based on scale」，例如「Eb, Fb, F ...」
	const notes: NoteAll[] = []
	const notesInner: (NoteAll | null)[] = []
	const intervals: IntervalAll[] = []
	const offset = transPitch(degrees[0].note)
	let degreeIndex = 0
	for (let i = 0; i < 12; i++) {
		if (degrees[degreeIndex] && degrees[degreeIndex].interval === i) {
			if (!degrees[degreeIndex].note) {
				throw new Error('DegreeType need note')
			}
			notes.push(degrees[degreeIndex].note!)
			notesInner.push(degrees[degreeIndex].note!)
			// intervals.push(in)
			degreeIndex++
		} else {
			notes.push(NOTE_FALLING_LIST[(i + offset) % 12])
			notesInner.push(null)
		}
	}

	// 2. 交换数组为「based on C」
	const cIndex = notes.indexOf('C')
	return {
		notes: [...notes],
		/**
		 * 12音
		 */
		notesOnC: notes.slice(cIndex).concat(notes.slice(0, cIndex)),
		/**
		 * 12音中饭只有调内音
		 */
		notesInnerOnC: notesInner.slice(cIndex).concat(notesInner.slice(0, cIndex)),
	}
}

// /**
//  * 调式 & 调 => 顺阶音调
//  * @param {
//  *  @attr mode 调式 默认「major自然大调」
//  *  @attr scale 大调音阶 默认「C调」
//  * }
//  * @returns 大调音阶顺阶音调 数组
//  */
// const transScale = ({ mode = 'major', scale = 'C' }: { mode?: ModeType; scale?: Tone }): DegreeScale[] => {
// 	const note = transNote(scale)
// 	const degreeArr = degreeMap.get(mode)

// 	if (!degreeArr || !note) {
// 		return []
// 	}

// 	const initIndex = NOTE_LIST.indexOf(note)
// 	const noteLength = NOTE_LIST.length

// 	// 根据调式顺阶degreeArr转换调式级数和tone
// 	return degreeArr.map((degree) => {
// 		const curIndex = (initIndex + degree.interval) % noteLength
// 		const tone = transToneSchema(curIndex)
// 		return {
// 			degree,
// 			tone,
// 		}
// 	})
// }

// /**
//  * 调式音 => 顺阶和弦
//  * @param {
//  *  @attr degrees 调式音 默认「C大调7个音」
//  *  @attr chordNumType 和弦类型 默认「3和弦」
//  * }
//  * @returns 大调音阶顺阶和弦 数组
//  */
// const transDegreeChord = ({
// 	degrees = transScale({}),
// 	chordNumType = 3,
// }: {
// 	degrees?: DegreeScale[]
// 	chordNumType?: ChordDegreeNum
// }) => {
// 	const degreeLength = degrees.length
// 	const chordScale = chordDegreeMap.get(chordNumType)?.interval || [] // 顺阶和弦级数增量

// 	// 根据转换的大调获取大调和弦
// 	return degrees.map((degree, index) => {
// 		const chord = chordScale.map((scale) => degrees[(index + scale - 1) % degreeLength].tone.note)
// 		if (chordNumType === 9) {
// 			// 九和弦的九度音（最后一位）与根音关系必须是大二度，比如 E 的九音是 F#，而不是 F
// 			const ninthIndex = (NOTE_LIST.indexOf(chord[0]) + 2) % NOTE_LIST.length
// 			chord.splice(4)
// 			chord.push(NOTE_LIST[ninthIndex])
// 		}
// 		const chordType = getChordType(chord)
// 		return {
// 			...degree,
// 			chord,
// 			chordType,
// 		}
// 	})
// }

// /**
//  * 调式 & 调 => 顺阶和弦 (transScale + transDegreeChord)
//  * @param {
//  *  @attr mode 调式 默认「major自然大调」
//  *  @attr scale 大调音阶 默认「C调」
//  *  @attr chordNumType 和弦类型 默认「3和弦」
//  * }
//  * @returns 大调音阶顺阶和弦 数组
//  */
// const transScaleDegree = ({
// 	mode = 'major',
// 	scale = 'C',
// 	chordNumType = 3,
// }: {
// 	mode?: ModeType
// 	scale?: Tone
// 	chordNumType?: ChordDegreeNum
// }): DegreeChord[] => {
// 	const degrees = transScale({ mode, scale })
// 	// 根据转换的大调获取大调和弦
// 	return transDegreeChord({ degrees, chordNumType })
// }

/**
 * 五度圈 ToneSchema 数组
 * @param root 根音 默认「C」
 */
const generateFifthCircle = (root: Tone = 'C') => {
	const pitch = transPitch(root)
	const step = 7 // 纯五度 Perfect 5th 半音数

	return new Array(NOTE_LIST.length).fill(1).map((_, index) => {
		const curIndex = (step * index + pitch) % 12
		return transToneSchema(curIndex)
	})
}

export {
	toDegreeTag, //和弦音 => 和弦名称[]
	intervalToSemitones, //度数 => 半音程
	rootToChord, //和弦根音 => 和弦
	toneToChordType, // 和弦tone => 和弦名称 & 类型
	pitchToChordType, // 和弦pitch => 和弦名称 & 类型
	// transScale, //调式 & 调 => 顺阶音调
	// transDegreeChord, //顺阶音调 => 顺阶和弦
	// transScaleDegree, //调式 & 调 => 顺阶和弦 (transScale + transDegreeChord)
	generateFifthCircle, // 五度圈[]
	scaleToDegree, // 调式 & 调 => 顺阶音
	scaleToDegreeWithChord, // 调式 & 调 => 顺阶音 & 级数 & 顺阶和弦
	degreesToNotes, // 根据级数获取完整 12 音名「based on C」
}
