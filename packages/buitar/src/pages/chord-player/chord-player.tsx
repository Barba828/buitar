import { memo, useEffect } from 'react'
import {
	ChordController,
	GuitarBoard,
	ChordCard,
	useBoardContext,
	DetailCard,
	BoardOptionsController,
} from '@/components/guitar-board'
import { transChordTaps } from '@buitar/to-guitar'
import { PianoBoard } from '@/components/piano-board'
import { VexChord } from '@/components/svg-chord'
import { useConfigContext, PagesMeta } from '@/components'
import { useIsMobile } from '@/utils/hooks/use-device'
import { getBoardChordName } from '@/components/guitar-board/board-controller/chord-card/utils'

export const ChordPlayer = () => {
	const { chord, chordTap, chordTaps, guitarBoardOption, setChordTaps, setTaps, clearTaps } =
		useBoardContext()
	const { menus } = useConfigContext()

	// 指板更新：清除和弦指位列表
	useEffect(() => {
		setChordTaps([])
	}, [guitarBoardOption])

	// 切换和弦：更新指板图列表
	useEffect(() => {
		setChordTaps(transChordTaps(chord, guitarBoardOption))
	}, [chord])

	// 切换指板图：更新Taps指位
	useEffect(() => {
		setTaps([])
	}, [chord, chordTaps])

	// 更新选中和弦：更新和弦显示指位
	useEffect(() => {
		if (chordTap) {
			setTaps(chordTap?.chordTaps)
		}
	}, [chordTap])

	useEffect(() => () => clearTaps(), [])

	return (
		<>
			<PagesMeta/>
			<ChordController />
			<ChordDetail />
			<GuitarBoard />
			<ChordKeyboard />
			{menus.board_setting && <BoardOptionsController extendItem={false} />}
		</>
	)
}

const ChordDetail = memo(() => {
	const { chordTap, boardOptions } = useBoardContext()
	const isMobile = useIsMobile()

	if (!chordTap) {
		return null
	}
	const title = getBoardChordName(chordTap.chordType, boardOptions)

	return (
		<div style={{ display: 'flex' }} className="scroll-without-bar">
			{/* 和弦大图卡片 */}
			<ChordCard taps={chordTap?.chordTaps} title={title} size={isMobile ? 120 : 160} />
			{/* 五线音阶卡片 */}
			<VexChord taps={chordTap?.chordTaps} />
			{/* 和弦详细信息 */}
			<DetailCard chordType={chordTap.chordType} />
		</div>
	)
})

const ChordKeyboard = () => {
	const { taps, player, boardOptions } = useBoardContext()
	const { isAllKey } = boardOptions
	const levels = isAllKey ? [2, 3, 4, 5] : [3]
	const notes = taps.map(
		(point) => `${point.toneSchema.note}${isAllKey ? point.toneSchema.level : 3}`
	)
	return <PianoBoard player={player} checked={notes} levels={levels} />
}
