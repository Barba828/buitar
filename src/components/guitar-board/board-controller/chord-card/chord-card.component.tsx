import React, { FC, useMemo } from 'react'
import { useBoardContext } from '../../board-provider'
import { SvgChord, transToSvgPoints } from '@/components/svg-chord'
import cx from 'classnames'
import styles from './chord-card.module.scss'
import { Icon } from '@/components/icon'
import { getBoardOptionsTone } from '@/components/guitar-board/utils'

export const ChordCard: FC = () => {
	const { taps, chordTaps, player, boardOptions } = useBoardContext()

	const cls = cx(
		'buitar-primary-button',
		styles['chord-card'],
		taps.length === 0 && styles['chord-card-hidden']
	)

	const handleClick = () => {
		player.triggerPointArpeggio(taps)
	}

	const handleSoundClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		e.stopPropagation()
		player.triggerPointRelease(taps)
	}

	const title = useMemo(() => {
		return chordTaps?.chordType[0]?.tone
			? getBoardOptionsTone(chordTaps?.chordType[0].tone, boardOptions)
			: ''
	}, [chordTaps?.chordType[0]?.tone])
	const tag = chordTaps?.chordType[0]?.tag

	return (
		<div onClick={handleClick} className={cls}>
			<SvgChord points={transToSvgPoints(taps)} size={160} title={`${title}${tag}`} />
			<div className={styles['chord-card-dot']} />
			<div className={styles['chord-card-icons']}>
				<div className={styles['chord-card-sounds']} onClick={handleSoundClick}>
					<Icon name="icon-eighth-note" size={16} />
				</div>
				<div className={styles['chord-card-sounds']} onClick={handleSoundClick}>
					<Icon name="icon-collection" size={16} />
				</div>
			</div>
		</div>
	)
}
