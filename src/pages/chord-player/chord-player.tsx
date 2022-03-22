import React, { useEffect } from 'react'
import {
	ChordController,
	ChordTapsController,
	GuitarBoard,
	ChordCard,
	BoardProvider,
	useBoardContext,
} from '@/components/guitar-board'
import { transChordTaps } from 'to-guitar'

export const ChordPlayer = () => {
	return (
		<BoardProvider>
			<ChordPlayerInner />
		</BoardProvider>
	)
}

const ChordPlayerInner = () => {
	const { chord, chordTaps, guitarBoardOption, setChordTaps, setTaps } = useBoardContext()

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
	return (
		<>
			<ChordController />
			<ChordTapsController />
			<GuitarBoard />
			<ChordCard />
		</>
	)
}
