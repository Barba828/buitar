import React, { FC, useEffect, useMemo, useState } from 'react'
import { Instrument } from '@/utils/tone-player/instrument.type'
import { GuitarBoardOptions } from '../board-controller/controller.type'
import { Board, BoardOption, Point, Tone, transChordTaps } from 'to-guitar'
import { TonePlayer } from '@/utils'
import { useStore } from '@/utils/hooks/use-store'
import { OPTIONS_KEY, INSTRUMENT_KEY } from '../board-controller'

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
	 * 是否全部展示键盘
	 */
	isAllKey: true,
	/**
	 * 键盘按压事件监听
	 */
	isPianoKeyDown: false,
}
/**
 * 吉他乐器默认配置
 */
const defaultInstrument = 'guitar-acoustic'
/**
 * 吉他播放器
 */
const player = new TonePlayer(defaultInstrument)

type BoardContextType = {
	// tone.js播放器
	player: TonePlayer
	// to-guitar.js指板
	guitar: Board

	// 指板内容
	guitarBoardOption: Partial<BoardOption>
	boardOptions: GuitarBoardOptions // 显示设置
	dispatchBoardOptions: Dispatch<GuitarBoardOptions>
	instrument: Instrument // 乐器设置
	dispatchInstrument: Dispatch<Instrument>

	// 乐理内容
	chord: Tone[] // 大调音阶和弦
	setChord: SetState<Tone[]>
	chordTaps: ReturnType<typeof transChordTaps> | null // 音阶和弦指位列表
	setChordTaps: SetState<ReturnType<typeof transChordTaps> | null>
	taps: Point[] // 指板选中Point
	setTaps: SetState<Point[]>
	emphasis: string[] // 指板强调Point
	setEmphasis: SetState<string[]>
}
const BoardContext = React.createContext<BoardContextType>({} as any)

/**
 * 获取吉他指板 Context
 */
export const useBoardContext = () => React.useContext(BoardContext)

export const BoardProvider: FC = (props) => {
	const [guitarBoardOption, setGuitarBoardOption] = useState<Partial<BoardOption>>({})
	const [boardOptions, dispatchBoardOptions] = useStore<GuitarBoardOptions>(
		OPTIONS_KEY,
		defaultBoardOptions
	)
	const [instrument, dispatchInstrument] = useStore<Instrument>(INSTRUMENT_KEY, defaultInstrument)
	const [chord, setChord] = useState<Tone[]>([])
	const [chordTaps, setChordTaps] = useState<ReturnType<typeof transChordTaps> | null>(null)
	const [taps, setTaps] = useState<Point[]>([])
	const [emphasis, setEmphasis] = useState<string[]>([])

	// 吉他指板实例化对象
	const guitar = useMemo(() => {
		const _board = new Board((board) => {
			// board对象更新时，emit执行setState
			setGuitarBoardOption(board)
		})
		// 实际上初始化 guitarBoardOption
		setGuitarBoardOption(_board.board)
		return _board
	}, [setGuitarBoardOption])

	// 切换乐器：加载乐器音源
	useEffect(() => {
		player.dispatchInstrument(instrument)
	}, [instrument])

	const boardValue = {
		player,
		guitar,
		guitarBoardOption,
		boardOptions,
		dispatchBoardOptions,
		instrument,
		dispatchInstrument,
		chord,
		setChord,
		chordTaps,
		setChordTaps,
		taps,
		setTaps,
		emphasis,
		setEmphasis,
	}
	return <BoardContext.Provider value={boardValue}>{props.children}</BoardContext.Provider>
}
