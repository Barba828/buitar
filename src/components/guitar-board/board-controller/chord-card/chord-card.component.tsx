import React, { FC, useMemo } from 'react'
import { useBoardContext } from '../../board-provider'
import { SvgChord, transToSvgPoints } from '@/components/svg-chord'
import cx from 'classnames'
import styles from './chord-card.module.scss'
import { Icon } from '@/components/icon'
import { getBoardOptionsNote } from '@/components/guitar-board/utils'
import { Portal } from '@/components'
import { ChordType, Point } from 'to-guitar'
import { GuitarBoardOptions } from '../controller.type'

export const ChordCard: FC<{
	taps: Point[]
	title?: string
	className?: string
	size?: number
	extra?: JSX.Element | JSX.Element[]
}> = ({ taps, title, className, size = 160, extra }) => {
	const { player } = useBoardContext()

	const cls = cx(
		'buitar-primary-button',
		styles['chord-card'],
		className,
		taps.length === 0 && styles['chord-card-hidden']
	)

	const handleClick = () => {
		player.triggerPointArpeggio(taps)
	}

	const handleSoundClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		e.stopPropagation()
		player.triggerPointRelease(taps)
	}

	const chordName = useChordName()
	const chordTitle = title || chordName

	const card = (
		<div onClick={handleClick} className={cls}>
			<SvgChord points={transToSvgPoints(taps)} size={size} title={chordTitle} />
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
	return extra ? (
		<Portal triggerType="hover" trigger={card}>
			{extra}
		</Portal>
	) : (
		card
	)
}

export const useChordName = (index: number = 0) => {
	const { chordTaps, boardOptions } = useBoardContext()

	return useMemo(() => {
		if (!chordTaps?.chordType[index]) {
			return ' '
		}
		return getChordName(chordTaps.chordType[index], boardOptions)
	}, [chordTaps?.chordType])
}

/**
 * 根据 chordType 获取和弦名称
 * @param chordType
 * @param boardOptions
 * @returns
 */
export const getChordName = (
	chordType: ChordType,
	boardOptions?: Pick<GuitarBoardOptions, 'isSharpSemitone'>
) => {
	// 自定义名称直接返回
	if (chordType.tag === '*') {
		return chordType.name
	}

	// 根据 tone 获取和弦名称
	if (!chordType.tone) return ' '
	const tone = boardOptions
		? getBoardOptionsNote(chordType.tone, boardOptions)
		: chordType.tone.note
	const over = chordType.over
		? boardOptions
			? getBoardOptionsNote(chordType.over, boardOptions)
			: chordType.over.note
		: ''
	const tag = chordType.tag
	if (over === tone) {
		return `${tone}${tag}`
	} else {
		return `${over}${tag}/${tone}`
	}
}

export const DetailCard: FC<{ index?: number }> = ({ index = 0 }) => {
	const { chord, chordTaps } = useBoardContext()
	const chordName = useChordName(index)
	const visible = !!chordTaps?.chordType[index]

	if (!visible) {
		return null
	}

	const title = chordTaps.chordType[index].name
	const subTitle =
		chordTaps.chordType[index].tag !== '*' ? chordTaps.chordType[index].name_zh : '自定义'
	return (
		<div className={cx(styles['detail-card'])}>
			<div className={cx('buitar-primary-button', styles['detail-view'])}>
				<div className={styles['detail-title']}>{chordName}</div>
				<div className={styles['detail-name']}>
					{title}
					<div className={styles['detail-subname']}>{subTitle}</div>
				</div>
			</div>
			<div className={styles['detail-chord']}>
				{chord.map((note, index) => (
					<div key={index} className="buitar-primary-button">
						{note}
					</div>
				))}
			</div>
		</div>
	)
}
