import { NOTE_LIST, chordMap, degreeMap, chordDegreeMap, DEGREE_TAG_MAP } from '../config'
import type { Note, Tone, ChordType, ChordDegreeNum, ModeType, Chord, IntervalNum } from '../interface'
import { transNote, transTone } from './trans-tone'

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
				NOTE_LIST.indexOf(item) - offset >= 0 ? NOTE_LIST.indexOf(item) - offset : NOTE_LIST.indexOf(item) - offset + NOTE_LIST.length
			)
			.sort((a, b) => a - b)

		// 排序完成根据音程计算key
		const key = intervals.reduce((pre, cur, curIndex) => pre * 10 + (cur - intervals[curIndex - 1] || 0), 0)

		const chordItem = chordMap.get(key)
		if (chordItem) {
			chordList.push({
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
	let num = Number(numStr) as IntervalNum
	if (num > 7) {
		num = (num % 7) as IntervalNum
	}
	return DEGREE_TAG_MAP[num]
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

/**
 * 调式 & 调 => 顺阶音调
 * @param {
 *  @attr mode 调式 默认「major自然大调」
 *  @attr scale 大调音阶 默认「C调」
 * }
 * @returns 大调音阶顺阶音调 数组
 */
const transScale = ({ mode = 'major', scale = 'C' }: { mode?: ModeType; scale?: Tone }): Chord[] => {
	const note = transNote(scale)
	const degreeArr = degreeMap.get(mode)

	if (!degreeArr || !note) {
		return []
	}

	const initIndex = NOTE_LIST.indexOf(note)
	const noteLength = NOTE_LIST.length

	// 根据大调顺阶degreeArr转换大调
	return degreeArr.map((degree) => {
		const curIndex = (initIndex + degree.interval) % noteLength
		const tone = transTone(curIndex)
		return {
			degree,
			tone,
			chord: [] as Note[],
			chordType: [] as ChordType[],
		}
	})
}

/**
 * 调式 & 调 => 顺阶和弦
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
}): Chord[] => {
	const degrees = transScale({ mode, scale })
	const degreeLength = degrees.length
	const chordScale = chordDegreeMap.get(chordNumType)?.interval || [] // 顺阶和弦级数增量

	// 根据转换的大调获取大调和弦
	degrees.forEach((degree, index) => {
		degree.chord = chordScale.map((scale) => degrees[(index + scale - 1) % degreeLength].tone.note)
		if (chordNumType === 9) {
			// 九和弦的九度音（最后一位）与根音关系必须是大二度，比如 E 的九音是 F#，而不是 F
			const ninthIndex = (NOTE_LIST.indexOf(degree.chord[0]) + 2) % NOTE_LIST.length
			degree.chord.splice(4)
			degree.chord.push(NOTE_LIST[ninthIndex])
		}
		degree.chordType = getChordType(degree.chord)
	})
	return degrees
}

/**
 * 和弦 => 和弦名称 & 类型
 * @param chords 和弦音数组
 * @param calGrades 升降度数 默认不变调
 */
const transChordType = (chords: Tone[], calGrades?: number) => {
	let chordNotes = transNote(chords)

	if (calGrades) {
		chordNotes = chordNotes
			.map((note) => NOTE_LIST.indexOf(note))
			.map((tone) => (tone + calGrades) % NOTE_LIST.length)
			.map((calTone) => NOTE_LIST[calTone])
	}

	return getChordType(chordNotes)
}

/**
 * 五度圈 数组
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

export { getDegreeTag, transChord, transChordType, transScale, transScaleDegree, transFifthsCircle }
