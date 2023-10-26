import React, { FC, useEffect, useMemo, useState, useCallback } from 'react'
import type { StringsInstrument } from '@buitar/tone-player'
import {
	GuitarBoardOptions,
	GuitarBoardThemeKey,
	InstrumentKeyboardKey,
} from '@/pages/settings/config/controller.type'
import {
	OPTIONS_KEY,
	INSTRUMENT_STRINGS_KEY,
	BOARD_THEME_KEY,
	INSTRUMENT_KEYBOARD_KEY,
	instrumentKeyboardConfig,
	instrumentKeyboardMap,
} from '@/pages/settings/config/controller.config'
import { Board, BoardChord, BoardOption, Point, Tone } from '@buitar/to-guitar'
import { TonePlayer } from '@buitar/tone-player'
import { useStore } from '@/utils/hooks/use-store'
import { COLLECTIONS_KEY, CollectionMapType } from '@/pages/collections/collections.config'
import { toast } from '@/components'

/**
 * 吉他指板默认配置
 */
const defaultBoardOptions: GuitarBoardOptions = {
	/**
	 * 是否显示半音
	 */
	isShowSemitone: false,
	/**
	 * 半音是否以#标记
	 */
	isSharpSemitone: true,
	/**
	 * 是否音名显示
	 */
	isNote: true,
	/**
	 * 是否显示八度音高
	 */
	hasLevel: false,
	/**
	 * 是否显示吉他品记
	 */
	hasTag: true,
	/**
	 * 吉他品记是否数字展示
	 */
	numTag: false,
	/**
	 * 是否全部展示键盘
	 */
	isAllKey: true,
	/**
	 * 是否固定 0 品
	 */
	isStickyZero: true,
}
/**
 * 默认收藏
 */
const defaultCollection: CollectionMapType = {
	guitar: [
		{
			title: 'Collection 1',
			intro: '',
			data: [],
		},
	],
	ukulele: [
		{
			title: 'Collection 1',
			intro: '',
			data: [],
		},
	],
	bass: [
		{
			title: 'Collection 1',
			intro: '',
			data: [],
		},
	],
}

type BoardContextType = {
	/**
	 * tone.js播放器
	 */
	player: TonePlayer
	/**
	 * to-guitar.js指板
	 */
	guitar: Board

	// 指板内容
	/**
	 * 吉他单例属性
	 */
	guitarBoardOption: Partial<BoardOption>
	/**
	 * 指板显示设置
	 */
	boardOptions: GuitarBoardOptions
	dispatchBoardOptions: Dispatch<GuitarBoardOptions>
	/**
	 * 乐器设置
	 */
	instrument: StringsInstrument
	dispatchInstrument: Dispatch<StringsInstrument>
	/**
	 *
	 */
	instrumentKeyboard: InstrumentKeyboardKey
	dispatchInstrumentKeyboard: Dispatch<InstrumentKeyboardKey>
	/**
	 * 指板UI主题
	 */
	boardTheme: GuitarBoardThemeKey
	dispatchBoardTheme: Dispatch<GuitarBoardThemeKey>
	/**
	 * 收藏和弦
	 */
	collection: CollectionMapType
	dispatchCollection: Dispatch<CollectionMapType>

	// 乐理内容
	/**
	 * 大调音阶和弦
	 */
	chord: Tone[]
	setChord: SetState<Tone[]>
	/**
	 * 音阶和弦指位列表
	 */
	chordTaps: BoardChord[]
	setChordTaps: SetState<BoardChord[]>
	/**
	 * 当前和弦指位
	 */
	chordTap: BoardChord | undefined
	setChordTap: SetState<BoardChord | undefined>
	/**
	 * 指板选中高亮展示Point
	 */
	taps: Point[]
	setTaps: SetState<Point[]>
	/**
	 * 指板固定高亮Point
	 */
	fixedTaps: Point[]
	setFixedTaps: SetState<Point[]>
	/**
	 * 指板交互强调反馈Point
	 */
	emphasis: string[]
	setEmphasis: SetState<string[]>
	/**
	 * 指板固定高亮 最高级Point
	 */
	highFixedTaps: Point[]
	setHighFixedTaps: SetState<Point[]>
	/**清理全部指位 */
	clearTaps(): void
}
const BoardContext = React.createContext<BoardContextType>({} as any)

/**
 * 获取吉他指板 Context
 */
export const useBoardContext = () => React.useContext(BoardContext)

export const BoardProvider: FC = (props) => {
	const player = window.tonePlayer as TonePlayer
	const [guitarBoardOption, setGuitarBoardOption] = useState<Partial<BoardOption>>({})
	const [boardOptions, dispatchBoardOptions] = useStore<GuitarBoardOptions>(
		OPTIONS_KEY,
		defaultBoardOptions
	)
	const [instrument, dispatchInstrument] = useStore<StringsInstrument>(
		INSTRUMENT_STRINGS_KEY,
		player.getInstrument() as StringsInstrument
	)
	const [instrumentKeyboard, dispatchInstrumentKeyboard] = useStore<InstrumentKeyboardKey>(
		INSTRUMENT_KEYBOARD_KEY,
		'guitar'
	)
	const [boardTheme, dispatchBoardTheme] = useStore<GuitarBoardThemeKey>(BOARD_THEME_KEY, 'fender')
	let [collection, dispatchCollection] = useStore<CollectionMapType>(
		COLLECTIONS_KEY,
		defaultCollection
	)
	const [chord, setChord] = useState<Tone[]>([])
	const [chordTaps, setChordTaps] = useState<BoardChord[]>([])
	const [chordTap, setChordTap] = useState<BoardChord>()
	const [taps, setTaps] = useState<Point[]>([])
	const [fixedTaps, setFixedTaps] = useState<Point[]>([])
	const [highFixedTaps, setHighFixedTaps] = useState<Point[]>([])
	const [emphasis, setEmphasis] = useState<string[]>([])

	// 吉他指板实例化对象
	const guitar = useMemo(() => {
		const _board = new Board((board) => {
			// board对象更新时，emit执行setState
			setGuitarBoardOption(board)
		})
		window.guitar = _board
		// 实际上初始化 guitarBoardOption
		setGuitarBoardOption(_board.board)
		return _board
	}, [setGuitarBoardOption])

	// 切换乐器音色：加载乐器音源
	useEffect(() => {
		player.dispatchInstrument(instrument).then(()=>{
			toast('音色加载完成')
		})
	}, [instrument])

	// 切换乐器指板：更新guitar实例
	useEffect(() => {
		guitar.setOptions(instrumentKeyboardConfig[instrumentKeyboard])
		// 切换指板默认切换音色
		const adjustInstrument = instrumentKeyboardMap.get(instrumentKeyboard)
		if (adjustInstrument) {
			dispatchInstrument({ type: 'set', payload: adjustInstrument })
		}
	}, [instrumentKeyboard])

	const clearTaps = useCallback(()=>{
		setTaps([])
		setEmphasis([])
		setFixedTaps([])
		setHighFixedTaps([])
	}, [])

	const boardValue = {
		player,
		guitar,

		guitarBoardOption,
		boardOptions,
		dispatchBoardOptions,
		instrument,
		dispatchInstrument,
		instrumentKeyboard,
		dispatchInstrumentKeyboard,
		boardTheme,
		dispatchBoardTheme,
		collection,
		dispatchCollection,

		chord,
		setChord,
		chordTaps,
		setChordTaps,
		chordTap,
		setChordTap,

		taps,
		setTaps,
		fixedTaps,
		setFixedTaps,
		highFixedTaps,
		setHighFixedTaps,
		emphasis,
		setEmphasis,
		clearTaps
	}
	return <BoardContext.Provider value={boardValue}>{props.children}</BoardContext.Provider>
}
