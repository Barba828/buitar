import {
	NOTE_LIST,
	chordMap,
	degreeMap,
	chordDegreeMap,
	DEGREE_TAG_MAP,
	intervalMap,
	NOTE_SORT,
	NOTE_MULTI_LIST,
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
} from '../interface'
import { transNote, transNoteAllPitch, transTone } from './trans-tone'

/**
 * 度数 => 半音程
 * 2# 大二度 => 3
 * 5b 减五度 => 6
 * 11 完全十一度 => 17
 * @param interval
 */
const transInterval = (interval: IntervalAll | Number) => {
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
 * 和弦音 => 和弦名称[]
 * @param chords
 */
const getChordType = (chords: Note[]): ChordType[] => {
	const tone = transTone(chords[0])
	const chordList: ChordType[] = []

	// 遍历和弦音中每个音当根音当情况（cover转位和弦）
	chords.forEach((chord, index) => {
		// 根音偏移
		const offset = NOTE_LIST.indexOf(chord)
		const rest = [...chords]
		rest.splice(index, 1)
		// 放置根音并对后面的音进行排序（设置offset便于排序，即排序结果根音恒在数组首位）
		const intervals = [chord, ...rest]
			.map((item) =>
				NOTE_LIST.indexOf(item) - offset >= 0
					? NOTE_LIST.indexOf(item) - offset
					: NOTE_LIST.indexOf(item) - offset + NOTE_LIST.length
			)
			.sort((a, b) => a - b)

		// 排序完成根据音程计算key
		const key = intervals.reduce((pre, cur, curIndex) => pre * 10 + (cur - intervals[curIndex - 1] || 0), 0)

		const chordItem = chordMap.get(key)
		if (chordItem) {
			chordList.push({
				key,
				tone,
				over: transTone(NOTE_LIST[offset]),
				...chordItem,
			})
		}
	})
	return chordList
}

/**
 * 数字级数 => 罗马级数
 * @param degree
 * @returns
 */
const getDegreeTag = (degree: string | number) => {
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
 * 和弦根音 => 和弦
 * @param tone 根音
 * @param chordTypeTag 和弦类型标记（'m'|'aug'|'dim'|...）
 * @returns
 */
const transChord = (tone: Tone, chordTypeTag: string = '') => {
	const note = transNote(tone)
	const chordTypeItem = Array.from(chordMap.entries()).find(([_key, value]) => value.tag === chordTypeTag)
	if (!chordTypeItem) {
		return null
	}

	const [key, chordType] = chordTypeItem
	const intervals = [NOTE_LIST.indexOf(note)]
	const intervalNums = key
		.toString()
		.split('')
		.map((item) => parseInt(item))
	intervalNums.reduce((preNum, curNum) => {
		const temp = (preNum + curNum) % NOTE_LIST.length
		intervals.push(temp)
		return temp
	}, intervals[0])

	const chord = intervals.map((interval) => NOTE_LIST[interval])

	return {
		chord,
		chordType,
	}
}

const getScaleDegreeList = ({ mode = 'major', scale = 'C' }: { mode?: ModeType; scale?: NoteAll }): DegreeType[] => {
	const pitch = transNoteAllPitch(scale)
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
			return getScaleDegreeList({ mode, scale: otherScale })
		}
	}
	return scaleNoteList
}

const transScaleDegreeList = ({
	degrees = getScaleDegreeList({}),
	chordNumType = 3,
}: {
	degrees?: DegreeType[]
	chordNumType?: ChordDegreeNum
}) => {
	const degreeLength = degrees.length
	const chordScale = chordDegreeMap.get(chordNumType)?.interval || [] // 顺阶和弦级数增量

	// 根据转换的大调获取大调和弦
	return degrees.map((degree, index) => {
		const chord = chordScale.map((scale) => degrees[(index + scale - 1) % 7].note!)
		const chordType = getChordType(chord as Note[])
		/**
		 * @TODO 统一九和弦计算方式
		 */
		console.log('lnz chordType', chord, chordType)
		// return {
		// 	...degree,
		// 	chord,
		// 	chordType,
		// }
	})
}

/**
 * 调式 & 调 => 顺阶音调
 * @param {
 *  @attr mode 调式 默认「major自然大调」
 *  @attr scale 大调音阶 默认「C调」
 * }
 * @returns 大调音阶顺阶音调 数组
 */
const transScale = ({ mode = 'major', scale = 'C' }: { mode?: ModeType; scale?: Tone }): DegreeScale[] => {
	const note = transNote(scale)
	const degreeArr = degreeMap.get(mode)

	if (!degreeArr || !note) {
		return []
	}

	const initIndex = NOTE_LIST.indexOf(note)
	const noteLength = NOTE_LIST.length

	// 根据调式顺阶degreeArr转换调式级数和tone
	return degreeArr.map((degree) => {
		const curIndex = (initIndex + degree.interval) % noteLength
		const tone = transTone(curIndex)
		return {
			degree,
			tone,
		}
	})
}

/**
 * 调式音 => 顺阶和弦
 * @param {
 *  @attr degrees 调式音 默认「C大调7个音」
 *  @attr chordNumType 和弦类型 默认「3和弦」
 * }
 * @returns 大调音阶顺阶和弦 数组
 */
const transDegreeChord = ({
	degrees = transScale({}),
	chordNumType = 3,
}: {
	degrees?: DegreeScale[]
	chordNumType?: ChordDegreeNum
}) => {
	const degreeLength = degrees.length
	const chordScale = chordDegreeMap.get(chordNumType)?.interval || [] // 顺阶和弦级数增量

	// 根据转换的大调获取大调和弦
	return degrees.map((degree, index) => {
		const chord = chordScale.map((scale) => degrees[(index + scale - 1) % degreeLength].tone.note)
		if (chordNumType === 9) {
			// 九和弦的九度音（最后一位）与根音关系必须是大二度，比如 E 的九音是 F#，而不是 F
			const ninthIndex = (NOTE_LIST.indexOf(chord[0]) + 2) % NOTE_LIST.length
			chord.splice(4)
			chord.push(NOTE_LIST[ninthIndex])
		}
		const chordType = getChordType(chord)
		return {
			...degree,
			chord,
			chordType,
		}
	})
}

/**
 * 调式 & 调 => 顺阶和弦 (transScale + transDegreeChord)
 * @param {
 *  @attr mode 调式 默认「major自然大调」
 *  @attr scale 大调音阶 默认「C调」
 *  @attr chordNumType 和弦类型 默认「3和弦」
 * }
 * @returns 大调音阶顺阶和弦 数组
 */
const transScaleDegree = ({
	mode = 'major',
	scale = 'C',
	chordNumType = 3,
}: {
	mode?: ModeType
	scale?: Tone
	chordNumType?: ChordDegreeNum
}): DegreeChord[] => {
	const degrees = transScale({ mode, scale })
	// 根据转换的大调获取大调和弦
	return transDegreeChord({ degrees, chordNumType })
}

/**
 * 和弦 => 和弦名称 & 类型
 * @param chords 和弦音数组
 * @param calGrades 升降度数 默认不变调
 */
const transChordType = (chords: Tone[], calGrades?: number) => {
	let chordNotes = Array.from(new Set(transNote(chords)))

	if (calGrades) {
		chordNotes = chordNotes
			.map((note) => NOTE_LIST.indexOf(note))
			.map((tone) => (tone + calGrades) % NOTE_LIST.length)
			.map((calTone) => NOTE_LIST[calTone])
	}

	return getChordType(chordNotes)
}

/**
 * 五度圈 ToneSchema 数组
 * @param root 根音 默认「C」
 */
const transFifthsCircle = (root: Tone = 'C') => {
	const note = transNote(root)
	const basicIndex = NOTE_LIST.indexOf(note)
	const step = 7 // 纯五度 Perfect 5th 半音数

	return new Array(NOTE_LIST.length).fill(1).map((_, index) => {
		const curIndex = (step * index + basicIndex) % NOTE_LIST.length
		return transTone(curIndex)
	})
}

export {
	getDegreeTag, //和弦音 => 和弦名称[]
	transInterval, //度数 => 半音程
	transChord, //和弦根音 => 和弦
	transChordType, //和弦 => 和弦名称 & 类型
	transScale, //调式 & 调 => 顺阶音调
	transDegreeChord, //顺阶音调 => 顺阶和弦
	transScaleDegree, //调式 & 调 => 顺阶和弦 (transScale + transDegreeChord)
	transFifthsCircle, // 五度圈[]
	getScaleDegreeList,
	transScaleDegreeList,
}
