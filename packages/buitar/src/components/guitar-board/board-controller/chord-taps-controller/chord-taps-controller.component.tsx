import { FC, memo, useCallback } from 'react'
import { useBoardContext } from '../../board-provider'
import { SvgChord, transToSvgPoints } from '@/components/svg-chord'
import { BoardChord, Point } from '@buitar/to-guitar'
import { ControllerList, ControllerListProps } from '@/components/controller'
import { useIsMobile } from '@/utils/hooks/use-device'

import styles from './chord-taps-controller.module.scss'

/**
 * 选择指法列表中的指法
 * @param props
 * @returns
 */
export const ChordTapsController: FC<
	ControllerListProps<BoardChord> & { onClickTap?(points: Point[]): void }
> = memo(({ onClickTap, ...props }) => {
	const {
		chordTaps,
		player,
		taps,
		setChordTap,
		guitarBoardOption: { keyboard },
	} = useBoardContext()
	const isMobile = useIsMobile()

	const handleClick = useCallback(
		(boardChord: BoardChord) => {
			const taps = boardChord.chordTaps
			setChordTap(boardChord)
			onClickTap?.(taps)
			player.triggerPointRelease(taps)
		},
		[onClickTap, player]
	)

	if (!chordTaps.length) {
		return null
	}

	return (
		<div className="scroll-without-bar">
			<ControllerList
				{...props}
				list={chordTaps}
				className={styles['chord-taps']}
				onClickItem={handleClick}
				renderListItem={(item) => {
					return (
						<div className="flex-center">
							<SvgChord
								points={transToSvgPoints(item.chordTaps, keyboard?.length)}
								size={isMobile ? 60 : 80}
								concise
							/>
						</div>
					)
				}}
				checkedItem={(item) => item.chordTaps === taps}
			/>
		</div>
	)
})
