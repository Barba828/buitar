import React, { FC, useEffect, useMemo, useState } from 'react'
import { Instrument } from '@/utils/tone-player/instrument.type'
import { GuitarBoardOptions } from '../board-controller/controller.type'
import { BoardOption, Point, Tone, transChordTaps } from 'to-guitar'
import { Board } from 'to-guitar'
import { TonePlayer } from '@/utils'

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
	setBoardOptions: SetState<GuitarBoardOptions>
	instrument: Instrument // 乐器设置
	setInstrument: SetState<Instrument>

	// 乐理内容
	chord: Tone[] // 大调音阶和弦
	setChord: SetState<Tone[]>
	chordTaps: ReturnType<typeof transChordTaps> | null // 音阶和弦指位列表
	setChordTaps: SetState<ReturnType<typeof transChordTaps> | null>
	taps: Point[] // 指位点列表
	setTaps: SetState<Point[]>
}
const BoardContext = React.createContext<BoardContextType>({} as any)

/**
 * 获取吉他指板 Context
 */
export const useBoardContext = () => React.useContext(BoardContext)

export const BoardProvider: FC = (props) => {
	const [guitarBoardOption, setGuitarBoardOption] = useState<Partial<BoardOption>>({})
	const [boardOptions, setBoardOptions] = useState<GuitarBoardOptions>(defaultBoardOptions)
	const [instrument, setInstrument] = useState<Instrument>(defaultInstrument)
	const [chord, setChord] = useState<Tone[]>([])
	const [chordTaps, setChordTaps] = useState<ReturnType<typeof transChordTaps> | null>(null)
	const [taps, setTaps] = useState<Point[]>([])

	// 吉他指板实例化对象
	const guitar = useMemo(() => {
		const _board = new Board((board) => {
			setGuitarBoardOption(board)
		})
		// 实际上初始化 guitarBoardOption
		setGuitarBoardOption(_board.board)
		return _board
	}, [setGuitarBoardOption])

	// 指板更新：清除和弦指位列表
	useEffect(() => {
		setChordTaps(null)
	}, [guitarBoardOption])

	// 切换和弦：更新指板图列表
	useEffect(() => {
		setChordTaps(transChordTaps(chord))
	}, [chord])

	// 切换指板图：更新Taps指位
	useEffect(() => {
		setTaps([])
	}, [chord, chordTaps])

	// 切换乐器：加载乐器音源
	useEffect(() => {
		player.setInstrument(instrument)
	}, [instrument])

	const boardValue = {
		guitarBoardOption,
		boardOptions,
		setBoardOptions,
		instrument,
		setInstrument,
		chord,
		setChord,
		chordTaps,
		setChordTaps,
		taps,
		setTaps,
		player,
		guitar,
	}
	return <BoardContext.Provider value={boardValue}>{props.children}</BoardContext.Provider>
}
