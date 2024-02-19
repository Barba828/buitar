import { transBoard, degreesToNotes, scaleToDegreeWithChord } from '../index'
import type { DegreeChord, ChordDegreeNum, GuitarBoard, ModeType, Point, Tone, NoteAll, DegreeType, IntervalAll } from '../interface'
import { DEFAULT_LEVEL, DEFAULT_TUNE, GRADE_NUMS } from '../config'
import { OnChange } from '../utils/on-change'

type BoardOption = {
	/**
	 * 调式「自然大调」
	 */
	mode: ModeType
	/**
	 * 音阶「 C 」
	 */
	scale: NoteAll
	/**
	 * 和弦类型「三和弦」
	 */
	chordNumType: ChordDegreeNum
	/**
	 * chords是否包含转位和弦「C/E」
	 */
	chordOver: boolean
	/**
	 * 调内顺阶和弦「 C Dm Em ... 」
	 * 与 chordNumType 相匹配
	 */
	chords: DegreeChord[]
    /**
     * 12音名（基于当前scale）
     */
    notes: NoteAll[];
	/**
	 * 12音名（基于C）
	 */
	notesOnC: NoteAll[];
	/**
	 * 12音级（基于当前scale）
	 */
    intervals: IntervalAll[];
	/**
	 * 12音名（基于C）
	 */
    intervalsOnC: IntervalAll[];
	/**
	 * 指板
	 * 「弦数」 * 「品数」
	 */
	keyboard: GuitarBoard
	/**
	 * 调音「 EADGBE 」「E2 A2 D3 ...」
	 * 数组长度也表示了指板「弦数」
	 */
	baseTone: Tone[] | string[]
	/**
	 * 指板「品数」
	 */
	baseFret: number
	/**
	 * 最低音 level 「 2 」
	 * 根音「 E 」默认为 E2 音
	 */
	baseLevel: number
}

type BoardOptionProps = Pick<
	BoardOption,
	'mode' | 'scale' | 'chordNumType' | 'chordOver' | 'baseTone' | 'baseFret' | 'baseLevel'
>

const defaultOptions: BoardOptionProps = {
	mode: 'major',
	scale: 'C',
	chordNumType: 3,
	chordOver: false,
	baseTone: DEFAULT_TUNE,
	baseFret: GRADE_NUMS,
	baseLevel: DEFAULT_LEVEL,
}

class Board {
	private readonly _board: BoardOption

	/**
	 * 指板图
	 * @param emit 指板数据修改回调函数
	 * @param options 配置
	 */
	constructor(private emit?: (board: BoardOption) => void, options?: Partial<BoardOptionProps>) {
		const _options = { ...defaultOptions, ...options }
		/**
		 * 顺序获取
		 * 1. getDegreesWithChord 获取对应级数和音名
		 * 2. getNotes 获取完整12音音名
		 * 3. getKeyBoard 根据完整音名获取指板
		 */
		const chords = this.getDegreesWithChord(_options)
		const noteList = this.getNotes(chords)
		Object.assign(_options, noteList)
		const keyboard = this.getKeyBoard(_options)

		this._board = OnChange(
			{
				..._options,
				chords,
				keyboard,
			} as BoardOption,
			() => {
				this.emit?.({ ...this._board })
			}
		)
	}

	get board() {
		return this._board
	}
	get chords() {
		return this._board.chords
	}
	get notes() {
		return this._board.notes
	}
	get notesOnC() {
		return this._board.notesOnC
	}
	get intervals() {
		return this._board.intervals
	}
	get intervalsOnC() {
		return this._board.intervalsOnC
	}
	get keyboard() {
		return this._board.keyboard
	}

	/**
	 * 设置Board属性，自动emit
	 * @param options
	 */
	setOptions = (options: Partial<BoardOptionProps>) => {
		const _options = { ...this._board, ...options }
		const keys = Object.keys(options)

		/**
		 * 更新 options 需要更新 顺阶和弦
		 */
		if (
			keys.includes('mode') ||
			keys.includes('scale') ||
			keys.includes('chordNumType') ||
			keys.includes('chordOver')
		) {
			const chords = this.getDegreesWithChord(_options)
			_options.chords = chords
		}

		/**
		 * 更新 options 需要更新 12音名
		 */
		if (keys.includes('mode') || keys.includes('scale')) {
			const noteList = this.getNotes(_options.chords)
			Object.assign(_options, noteList)
		}

		/**
		 * 更新 options 需要更新 指板
		 */
		if (
			keys.includes('mode') ||
			keys.includes('scale') ||
			keys.includes('baseTone') ||
			keys.includes('baseFret') ||
			keys.includes('baseLevel')
		) {
			const keyboard = this.getKeyBoard(_options)
			_options.keyboard = keyboard
		}

		Object.assign(this._board, _options)
	}

	/**
	 * 获取当前调式 & 音阶的顺阶和弦
	 * @param options
	 * @returns
	 */
	private getDegreesWithChord = (options: BoardOptionProps) => {
		return scaleToDegreeWithChord({ mode: options.mode, scale: options.scale, chordNumType: options.chordNumType })
	}

	/**
	 * 获取完整12音音名
	 * @param degrees 音阶级数
	 * @returns
	 */
	private getNotes = (degrees: DegreeType[]) => {
		return degreesToNotes(degrees)
	}

	/**
	 * 获取当前设置的指板
	 * @param options
	 * @returns
	 */
	private getKeyBoard = (options: Partial<BoardOption>) => {
		return transBoard(options.baseTone, {
			gradeLength: options.baseFret,
			baseLevel: options.baseLevel,
			notes: options.notesOnC,
			intervals: options.intervalsOnC,
		})
	}

	/**
	 * 自定义 Keyboard point
	 * @param points
	 */
	setKeyboardStatus = (points: Point[]) => {
		points.forEach((point) => {
			const boardPoint = this._board.keyboard[point.string][point.grade]
			if (boardPoint) {
				this._board.keyboard[point.string][point.grade] = { ...boardPoint, ...point }
			}
		})
	}

	resetKeyboardStatus = () => {
		this._board.keyboard = this.getKeyBoard(this._board)
	}
}

export { Board, BoardOption, BoardOptionProps, defaultOptions as defaultBoardOptions }
