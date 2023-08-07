import { useEffect } from 'react'
import {
	ChordController,
	GuitarBoard,
	ChordCard,
	BoardProvider,
	useBoardContext,
	BoardController,
	DetailCard,
} from '@/components/guitar-board'
import { transChordTaps } from '@buitar/to-guitar'
import { PianoBoard } from '@/components/piano-board'
import { usePagesIntro } from '@/components'
import { useIsMobile } from '@/utils/hooks/use-device'

export const ChordPlayer = () => {
	const intro = usePagesIntro()

	return (
		<BoardProvider>
			{intro}
			<ChordPlayerInner />
		</BoardProvider>
	)
}

const ChordPlayerInner = () => {
	const { chord, chordTaps, guitarBoardOption, setChordTaps, setTaps } = useBoardContext()
	const isMobile = useIsMobile()

	// 指板更新：清除和弦指位列表
	useEffect(() => {
		setChordTaps(null)
	}, [guitarBoardOption])

	// 切换和弦：更新指板图列表
	useEffect(() => {
		setChordTaps(transChordTaps(chord, guitarBoardOption.keyboard))
	}, [chord])

	// 切换指板图：更新Taps指位
	useEffect(() => {
		setTaps([])
	}, [chord, chordTaps])

	return (
		<>
			<ChordController />
			<ChordDetail />
			<GuitarBoard />
			<ChordKeyboard />
			<BoardController extendItem={false}/>
		</>
	)
}

const ChordDetail = () => {
	const { taps } = useBoardContext()
	const isMobile = useIsMobile()

	return (
		<div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>
			<ChordCard taps={taps} size={isMobile ? 120 : 160} />
			<DetailCard />
		</div>
	)
}

const ChordKeyboard = () => {
	const { taps, player, boardOptions } = useBoardContext()
	const { isAllKey } = boardOptions
	const levels = isAllKey ? [2, 3, 4, 5] : [3]
	const notes = taps.map(
		(point) => `${point.toneSchema.note}${isAllKey ? point.toneSchema.level : 3}`
	)
	return <PianoBoard player={player} checked={notes} levels={levels} />
}
