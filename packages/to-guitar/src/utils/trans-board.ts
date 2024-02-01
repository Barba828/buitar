import type { BoardOption } from 'src/board'
import {
	DEFAULT_LEVEL,
	DEFAULT_TUNE,
	DEFAULT_ABSOLUTE_TUNE,
	FINGER_GRADE_NUMS,
	GRADE_NUMS,
	degreeMap,
	NOTE_FALLING_LIST,
} from '../config'
import type {
	Tone,
	Point,
	GuitarBoard,
	GuitarString,
	ModeType,
	Pitch,
	BoardChord,
	BoardPosition,
	NoteAll,
} from '../interface'
import { getChordTypeByPitch } from './trans'
import { transPitch } from './trans-tone'

/**
 * 便于计算，默认调音一线零品为低音，即
 * 数字 0~11 => 低音 C~B
 * 数字 12~23 => 标音 C~B
 * 数字 24~35 => 高音 C~B
 *
 * 标准调弦吉他：['E2', 'A2', 'D3', 'G3', 'B3', 'E4']
 * 即绝对音高为：[4, 9, 14, 19, 23, 28]
 */

/**
 * 判断是否 'E2', 'A2' 等形式的音符
 * @param note
 * @returns
 */
const matchPitchNote = (note: string) => note.match(/^(.*?)(\d)$/)

/**
 * 根据相对音高获取pitchs，调音 => 绝对音高 (单调递增)
 * ['E', 'A', 'D', 'G', 'B', 'E'] -> ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'] -> [4, 9, 14, 19, 23, 28]
 * @param zeroTones 0品调音
 * @returns pitchs 绝对音高数组
 */
const getAdditionPitchs = (zeroTones: Tone[] = DEFAULT_TUNE) => {
	const pitchs = transPitch(zeroTones)

	for (let index = 1; index < pitchs.length; index++) {
		let pitch = pitchs[index]
		while (pitch < pitchs[index - 1]) {
			pitch += 12
		}
		pitchs[index] = pitch
	}

	return pitchs
}

/**
 * 根据绝对音高获取pitchs
 * @param zeroTones
 * @returns
 */
const getAbsolutePitchs = (zeroTones: string[] = DEFAULT_ABSOLUTE_TUNE) => {
	let lowest = Infinity
	const pitchsNote = zeroTones.map((str, index) => {
		let matchs = matchPitchNote(str)

		// 使用默认0品设置兜底
		if (!matchs) {
			matchs = matchPitchNote(DEFAULT_ABSOLUTE_TUNE[index])!
		}

		const pitch = transPitch(matchs[1] as Tone)
		const base = Number(matchs[2]) || 0
		if (base < lowest) {
			lowest = base
		}
		return { pitch, base }
	})

	return {
		pitchs: pitchsNote.map(({ pitch, base }) => pitch + (base - lowest) * 12),
		baseLevel: lowest,
	}
}

/**
 * 0品调音 => 指板二维数组
 * ['E', 'A', 'D', 'G', 'B', 'E'] 默认根音升高方式排列
 * ['G3', 'C3', 'E3', 'A4'] 可以手动设置音高，会覆盖 baseLevel 基准音高
 * @param zeroGrades 指板0品调音
 * @param {
 *  @attr gradeLength 指板品数
 *  @attr baseLevel 基准音高
 *  @attr notes 12音名「based on C」例如['C', 'Db', 'D', ...]
 * }
 * @returns Point[][]
 */
const transBoard = (
	zeroTones: Array<Tone | NoteAll | string> = DEFAULT_TUNE,
	options: {
		notes?: NoteAll[]
		gradeLength?: number
		baseLevel?: number
	} = {}
) => {
	let { notes = NOTE_FALLING_LIST, gradeLength = GRADE_NUMS, baseLevel = DEFAULT_LEVEL } = options
	let zeroPitchs = [] // 基于 C 调的 0品绝对音高
	if (matchPitchNote(String(zeroTones[0]))) {
		// 匹配 E2 A2 0品绝对音高
		const absolutePitchs = getAbsolutePitchs(zeroTones as string[])
		zeroPitchs = absolutePitchs.pitchs
		baseLevel = absolutePitchs.baseLevel
	} else {
		// 匹配 E A 相对单增音高
		zeroPitchs = getAdditionPitchs(zeroTones as Tone[])
	}

	const boardNums = zeroPitchs.map((zeroPitch, stringIndex) => {
		const stringNums: GuitarString = []
		for (let grade = 0; grade < gradeLength; grade++) {
			const pitch = zeroPitch + grade
			const tone = pitch % 12
			const note = notes[tone]
			const index = stringIndex * gradeLength + grade
			const level = Math.floor(pitch / 12) + baseLevel

			const point = {
				tone,
				pitch,
				note,
				level,
				string: stringIndex + 1,
				grade,
				index,
			} as Point

			stringNums[grade] = point
		}
		return stringNums
	})

	return boardNums as GuitarBoard
}

/**
 * 和弦音名数组 + 指板 => 和弦指法
 * @param chords 和弦音数组
 * @param options 指板配置
 */
const transChordTaps = (
	tones: Tone[],
	options: {
		/**手指品位跨度 */
		fingerSpan?: number
	} & Partial<Pick<BoardOption, 'keyboard' | 'chordOver'>> = {}
) => {
	const { fingerSpan = FINGER_GRADE_NUMS, keyboard = transBoard(), chordOver = false } = options
	const chords = Array.from(new Set(transPitch(tones)))
	// 无效和弦组成音
	if (!chords.length) {
		return []
	}

	// 指板上的所有根音
	const overRoots = chordOver
		? // 根音包括chords里所有音（转位和弦）
		  chords.map((chord) => ({
				chordType: getChordTypeByPitch(Array.from(new Set([chord, ...chords])))[0],
				chordTapsList: [] as Point[][],
		  }))
		: // 仅以chords第一个音为根音
		  [
				{
					chordType: getChordTypeByPitch(chords)[0],
					chordTapsList: [] as Point[][],
				},
		  ]
	let tapsList: BoardChord[] = [] // 指板上所有的符合的和弦 数组
	let list: Point[][] = []

	/**
	 * 递归获取当前弦之后所有符合和弦音的和弦列表
	 * @param stringIndex 当前弦下标
	 * @param taps 递归当前和弦列表
	 */
	const findNextString = (stringIndex: number, taps: Point[], allTaps: Point[][]) => {
		// 遍历完所有弦，递归结束
		if (stringIndex >= keyboard.length) {
			allTaps.push(taps)
			return
		}

		// 暂不考虑跳过当前弦选下一根弦的情况
		// findNextString(stringIndex + 1, [...taps])
		const grades = keyboard[stringIndex]
		grades.forEach((point) => {
			if (chords.includes(point.tone)) {
				// 若和「其他非0品位的按位」品位差不超过4，或者「该品」是0品，则加入指位
				if (
					taps.every((tap) => tap.grade === 0 || Math.abs(tap.grade - point.grade) < fingerSpan) ||
					point.grade === 0
				) {
					findNextString(stringIndex + 1, [...taps, point], allTaps)
				}
			}
		})
	}

	/**
	 * 过滤 和弦指法手指按位超过 4（正常指法不超过4根手指，这里4不是fingerSpan「和弦品位跨度」）
	 * 		& 手指不超过 1
	 * 		& 非零最小品不超过 12 （超过12品重复的八度音高）
	 * @param taps
	 */
	const fingersFilter = (taps: Point[]) => {
		// 最小品位（最小品位超过1，则为横按指法）
		const minGrade = Math.min(...taps.map((tap) => tap.grade))
		let fingerNums = minGrade > 0 ? 1 : 0
		// 非零最小品位
		let notZeroMinGrade = Infinity
		taps.forEach((tap) => {
			if (tap.grade > minGrade) {
				fingerNums++
			}
			if (tap.grade > 0 && tap.grade < notZeroMinGrade) {
				notZeroMinGrade = tap.grade
			}
		})
		return fingerNums <= 4 && fingerNums >= 1 && minGrade < 12 && notZeroMinGrade < 12
	}

	/**
	 * 过滤 非完整和弦音组成
	 * @todo 优化 真实的和弦组成音不一定绝对完整，比如七和弦可以不要 5 音
	 * @param taps
	 */
	const integrityFilter = (taps: Point[]) => {
		const notes = new Set(taps.map((tap) => tap.note))
		return notes.size === chords.length
	}

	/**
	 * 过滤 重复的和弦音
	 * @example 1.连续两根弦高8度 相同tone （一弦0品E + 二弦7品E）
	 * @example 2.存在相同绝对音高 相同pitch（一弦10品D + 三弦0品D）
	 * @param taps
	 */
	const repeatingPitchFilter = (taps: Point[]) => {
		// 1.连续两根弦高8度
		for (let i = 0; i < taps.length - 1; i++) {
			if (taps[i].tone === taps[i + 1].tone) {
				return false
			}
		}

		// 2.存在相同绝对音高
		const pitchs = new Set(taps.map((tap) => tap.pitch))
		return pitchs.size === taps.length
	}

	/**
	 * 除重 Array.reduce 移除重复和弦（指型覆盖）
	 * @example [F:133211] => [F:xx3211] 弦覆盖
	 * @todo 两个和弦的差别在于 0 品和 12 品的区别
	 * @param prevArr
	 * @param curChord
	 */
	const coverTapsReducer = (prevArr: Point[][], curChord: Point[]) => {
		// 遍历已选的无重复的指型
		for (let i = 0; i < prevArr.length; i++) {
			const prevChord = prevArr[i]

			if (prevChord.every((prevPoint) => curChord.includes(prevPoint))) {
				// 1.当前指型可以覆盖已选的指型，则替换该已选指型
				prevArr[i] = curChord
				return prevArr
			} else if (curChord.every((curPoint) => prevChord.includes(curPoint))) {
				// 2.当前指型可以被已选指型覆盖，则跳出本次循环
				return prevArr
			}
		}

		// 3.指型不能互相覆盖，则加入新指型
		prevArr.push(curChord)
		return prevArr
	}

	/**
	 * 排序 Array.sort 根据该和弦品位从低至高
	 * @param tapsA
	 * @param tapsB
	 */
	const gradeSorter = (chordTapsA: Point[], chordTapsB: Point[]) => {
		const maxGradeA = Math.max(...chordTapsA.map((tap) => tap.grade))
		const maxGradeB = Math.max(...chordTapsB.map((tap) => tap.grade))
		return maxGradeA - maxGradeB
	}

	// 检索根音位置，获取该根音匹配的所有和弦指位
	keyboard.forEach((grades, stringIndex) => {
		// 有几根弦 > 和弦音数
		if (stringIndex > keyboard.length - chords.length) {
			return
		}
		grades.forEach((point) => {
			// 多个转位获取根音位置
			overRoots.forEach((root) => {
				// 获取指板上Point音等于根音的位置，在一个八度内（12品）
				if (root?.chordType?.tone === point.tone && point.grade < 12) {
					list = []
					// 获取该根音下所有和弦
					findNextString(point.string, [point], list)
					// 增加当前point为根音的和弦
					root.chordTapsList.push(...list)
				}
			})
		})
	})

	// 扁平化多转位和弦
	overRoots.forEach((item) => {
		// 格式化当前转位的所有和弦
		let tempList = item.chordTapsList
			.filter(integrityFilter) // 过滤无效和弦
			.filter(fingersFilter)
			.filter(repeatingPitchFilter)
			.reduce(coverTapsReducer, []) // 移除和弦指型覆盖
			.sort(gradeSorter) // 按最低品排序
			.map((taps) => ({ chordType: item.chordType, chordTaps: taps } as BoardChord))

		if (tempList) {
			tapsList.push(...tempList)
		}
	})

	return tapsList
}

interface TapsRangeProps {
	/**指板实例 */
	board?: GuitarBoard
	/**指板范围 */
	range?: number[]
	/**忽略绝对音高相同的指位 */
	ignorePitch?: boolean
	/**调式 */
	mode?: ModeType
}

/**
 * 获取调式音阶基础指法(上行 & 下行)
 * @param root 根音
 * @param board 指板
 * @param mode 调式
 */
const getModeFregTaps = (root: Point, board: GuitarBoard = transBoard(), mode: ModeType = 'minor-pentatonic') => {
	let up: Point[] = [],
		down: Point[] = []
	// 获取该调式音程关系
	const intervals = degreeMap.get(mode)?.map((item) => item.interval)
	if (!intervals) {
		return { up, down }
	}

	// 获取有效相对音高，在根音品数range范围内的所有相对音高符合即可
	const rootTone = root.tone // 根音相对音高
	// 音阶相对音高
	const toneList = intervals.map((interval) => (interval + rootTone) % 12)

	const rootGrade = root.grade // 根音品位置
	// 音阶上行指法
	if (mode.includes('major') && (root.string === 1 || root.string === 5 || root.string === 6)) {
		up = getTapsFromBoard(toneList, { board, range: [rootGrade - 4, rootGrade] })
	} else {
		up = getTapsFromBoard(toneList, { board, range: [rootGrade - 3, rootGrade + 1] })
	}
	// 音阶下行指法
	if (mode.includes('minor') && (root.string === 2 || root.string === 4)) {
		down = getTapsFromBoard(toneList, { board, range: [rootGrade, rootGrade + 4] })
	} else {
		down = getTapsFromBoard(toneList, { board, range: [rootGrade - 1, rootGrade + 3] })
	}
	return { up, down }
}

/**
 * 获取指板某范围内某调式音阶
 * @param root
 * @param options
 * @returns
 */
const getModeRangeTaps = (root: Point | Tone, options: TapsRangeProps) => {
	const { board = transBoard(), mode = 'minor-pentatonic', range = [0, 5], ignorePitch } = options
	const intervals = degreeMap.get(mode)?.map((item) => item.interval)
	if (!intervals) {
		return []
	}
	// 获取有效相对音高，在range范围内的所有相对音高符合即可
	const rootTone = isPoint(root) ? root.tone : transPitch(root)
	// 音阶相对音高
	const toneList = intervals.map((interval) => (interval + rootTone) % 12)

	return getTapsFromBoard(toneList, { board, range, ignorePitch })
}

/**
 * 通过相对音高获取指板范围内所有符合音高的指位
 * @param tones 相对音高
 * @param options
 * @returns
 */
const getTapsFromBoard = (tones: Pitch[], options: TapsRangeProps) => {
	const { board = transBoard(), range = [], ignorePitch = true } = options
	const points: Point[] = []
	// 默认范围取 0 ～ 指板长度
	const [start = 0, end = board[0].length - 1] = range
	for (let string = 0; string < board.length; string++) {
		for (let grade = start; grade <= end; grade++) {
			const point = board[string][grade]
			if (!point) {
				continue
			}
			if (ignorePitch && points.find((p) => p.pitch === point.pitch)) {
				continue
			}
			if (tones.includes(point.tone)) {
				points.push(point)
			}
		}
	}
	return points
}

/**
 * 根据指位获取Taps
 * { x弦, y品} => Point
 */
const getTapsOnBoard = (positions: BoardPosition[], keyboard: BoardOption['keyboard']) => {
	return positions.map(({ string, grade }) => keyboard[string - 1][grade])
}

const isPoint = (x: any): x is Point => {
	if (typeof x !== 'object') {
		return false
	}
	return 'tone' in x && 'pitch' in x
}

export {
	transBoard, // 二维指板数组
	transChordTaps, // 和弦指板位置
	getModeFregTaps, // 获取调式音阶基础指法(上行 & 下行)
	getModeRangeTaps, // 获取指板某范围内某调式音阶
	getTapsOnBoard, // 根据指位获取Taps
}
