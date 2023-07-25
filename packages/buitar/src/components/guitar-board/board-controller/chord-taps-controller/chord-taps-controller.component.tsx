import React, { FC, useCallback } from 'react'
import { ControllerList } from '../controller'
import { ControllerProps } from '../option-controller'
import { useBoardContext } from '../../board-provider'
import { SvgChord, transToSvgPoints } from '@/components/svg-chord'

import styles from './chord-taps-controller.module.scss'
import { Point } from '@buitar/to-guitar'

/**
 * 选择指法列表中的指法
 * @param props
 * @returns
 */
export const ChordTapsController: FC<ControllerProps & { onClickTap?(points: Point[]): void }> = ({
	onClickTap,
	...props
}) => {
	const { chordTaps, player, taps, setTaps } = useBoardContext()

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
					return <SvgChord points={transToSvgPoints(item)} size={80} concise />
				}}
				checkedItem={(item) => item === taps}
				visibleItem={() => true}
			/>
		</div>
	)
}
