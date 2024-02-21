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
	NoteAll,
	DegreeType,
	Pitch,
} from '../interface'
import { transPitch, transToneSchema } from './trans-tone'

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
		throw Error('Invalid chordTypeTag')
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
		/**
		 * 和弦音pitch
		 */
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
 * { mode: 'major-pentatonic', scale: 'E'} => [E, F#, G#, B, C#]
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
		if (degreeArr.length < 7) {
			// 非现代7级音乐「五声音阶/布鲁斯音阶」
			scaleNoteList.push({
				...degree,
				note: currMultiNode.sort((a, b) => {
					if (a.length !== b.length) {
						return a.length - b.length
					}
					return a.includes('b') ? -1 : 1
				})[0], // 选择最短的音名(E > Fb > D#)
			})
		} else {
			// 7级音乐，取 NOTE_SORT 排序 Note
			const currSortNote = NOTE_SORT[(i + sortOffset) % degreeArr.length] // 当前音名（无升降号）
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
		const chordDegreeArr = chordScale.map((scale) => scaleDegrees[(index + scale - 1) % scaleDegrees.length])
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
		throw new Error('DegreeType need note')
	}

	// 1. 获取12音名「based on scale」，例如「Eb, Fb, F ...」
	const notes: NoteAll[] = []
	const intervals: IntervalAll[] = []
	const offset = transPitch(degrees[0].note)
	let degreeIndex = 0
	for (let i = 0; i < 12; i++) {
		if (degrees[degreeIndex] && degrees[degreeIndex].interval === i) {
			// degree里存在，调内音，直接使用
			if (!degrees[degreeIndex].note) {
				throw new Error('DegreeType need note')
			}
			notes.push(degrees[degreeIndex].note!)
			intervals.push((degreeIndex + 1) as IntervalNum)
			degreeIndex++
		} else {
			// degree里不存在，调外音，使用降调b表示形式「b比#更适用」
			notes.push(NOTE_FALLING_LIST[(i + offset) % 12]) // 降调Note
			intervals.push(`${degreeIndex + 1}b` as IntervalAll) // 降调级数表示时，会有bb这样的双降音
			if (i > 0 && intervals[i - 1].toString().endsWith('b')) {
				intervals[i - 1] = `${intervals[i - 1]}b` as IntervalAll
			}
		}
	}

	// 2. 交换数组为「based on C」
	const cIndex = notes.indexOf('C')
	return {
		notes: [...notes],
		notesOnC: notes.slice(cIndex).concat(notes.slice(0, cIndex)),
		intervals: [...intervals],
		intervalsOnC: intervals.slice(cIndex).concat(intervals.slice(0, cIndex)),
	}
}

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
	scaleToDegree, // 调式 & 调 => 顺阶音
	scaleToDegreeWithChord, // 调式 & 调 => 顺阶音 & 级数 & 顺阶和弦
	degreesToNotes, // 根据级数获取完整 12 音名「based on C」

	generateFifthCircle, // 五度圈[]
}
