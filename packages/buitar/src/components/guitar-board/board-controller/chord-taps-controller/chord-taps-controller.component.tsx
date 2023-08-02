import { FC, useCallback } from 'react'
import { useBoardContext } from '../../board-provider'
import { SvgChord, transToSvgPoints } from '@/components/svg-chord'
import { Point } from '@buitar/to-guitar'
import { ControllerList, ControllerListProps } from '@/components/controller'
import { useIsMobile } from '@/utils/hooks/use-device'

import styles from './chord-taps-controller.module.scss'

/**
 * 选择指法列表中的指法
 * @param props
 * @returns
 */
export const ChordTapsController: FC<
	ControllerListProps<Point[]> & { onClickTap?(points: Point[]): void }
> = ({ onClickTap, ...props }) => {
	const { chordTaps, player, taps, setTaps } = useBoardContext()
	const isMobile = useIsMobile()

	const handleClick = useCallback(
		(points: Point[]) => {
			setTaps(points)
			onClickTap?.(points)
			player.triggerPointRelease(points)
		},
		[setTaps, onClickTap, player]
	)

	if (!chordTaps) {
		return null
	}

	const { chordList } = chordTaps
	return (
		<div className="scroll-without-bar">
			<ControllerList
				{...props}
				list={chordList}
				className={styles['chord-taps']}
				onClickItem={handleClick}
				renderListItem={(item) => {
					return (
						<div className="flex-center">
							<SvgChord points={transToSvgPoints(item)} size={isMobile ? 60 : 80} concise />
						</div>
					)
				}}
				checkedItem={(item) => item === taps}
			/>
		</div>
	)
}
