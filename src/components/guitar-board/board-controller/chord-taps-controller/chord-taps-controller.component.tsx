import React, { FC, useCallback } from 'react'
import { ControllerList } from '../controller'
import { ControllerProps } from '../option-controller'
import { useBoardContext } from '../../board-provider'
import { SvgChord, transToSvgPoints } from '@/components/svg-chord'

import styles from './chord-taps-controller.module.scss'
import { Point } from 'to-guitar'

export const ChordTapsController: FC<ControllerProps> = (props) => {
	const { chordTaps, player, taps, setTaps } = useBoardContext()

	const handleClick = useCallback(
		(points: Point[]) => {
			player.triggerPointRelease(points)
			setTaps(points)
		},
		[setTaps]
	)

	if (!chordTaps) {
		return null
	}

	const { chordList } = chordTaps
	return (
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
	)
}
