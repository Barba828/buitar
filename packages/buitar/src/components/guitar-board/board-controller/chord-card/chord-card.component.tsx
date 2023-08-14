import React, { FC, useMemo, useState, memo } from 'react'
import { useBoardContext } from '../../board-provider'
import { SvgChord, transToSvgPoints } from '@/components/svg-chord'
import { Icon } from '@/components/icon'
import { Portal } from '@/components'
import { BoardChord, NOTE_LIST, Point, Tone, getDegreeTag } from '@buitar/to-guitar'
import { CardCollector } from './card-collector.component'
import { getBoardChordName } from './utils'
import cx from 'classnames'
import styles from './chord-card.module.scss'

export const ChordCard: FC<{
	taps: Point[]
	/**
	 * Chord标题
	 */
	title: string
	/**
	 * 是否显示收藏/移除按钮
	 */
	disableCollect?: boolean
	/**
	 * 有移除函数则为移除按钮
	 */
	onRemoveCollection?: () => void
	className?: string
	size?: number
	extra?: JSX.Element | JSX.Element[]
}> = memo(({ taps, title, className, size = 160, extra, disableCollect, onRemoveCollection }) => {
	if (title.length === 0) {
		title = ' '
	}
	const {
		player,
		guitarBoardOption: { keyboard },
	} = useBoardContext()
	const [collectionVisible, setCollectionVisible] = useState(false)

	const cls = cx(
		'buitar-primary-button',
		styles['chord-card'],
		className,
		taps.length === 0 && styles['chord-card-hidden']
	)

	const svgPoints = useMemo(() => transToSvgPoints(taps, keyboard?.length), [taps])

	const handleClick = () => {
		player.triggerPointArpeggio(taps)
		setCollectionVisible(false)
	}

	const handleSoundClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		e.stopPropagation()
		player.triggerPointRelease(taps)
	}

	const handleCollectionVisible = (e?: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		e?.stopPropagation()
		setCollectionVisible(!collectionVisible)
	}

	const handleRemoveCollection = (e?: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		e?.stopPropagation()
		onRemoveCollection?.()
	}

	const collectionData = {
		taps,
		title,
	}

	const card = (
		<div className={styles.container}>
			<div onClick={handleClick} className={cls} style={{ width: size * 1.2, height: size * 1.2 }}>
				<SvgChord points={svgPoints} size={size} title={title} />
				<div className={styles['chord-card-dot']} />
				<div className={styles['chord-card-icons']}>
					<div className={styles['chord-card-sounds']} onClick={handleSoundClick}>
						<Icon name="icon-eighth-note" size={16} />
					</div>
					{disableCollect ? null : onRemoveCollection ? (
						<div className={styles['chord-card-sounds']} onClick={handleRemoveCollection}>
							<Icon name="icon-delete" size={16} />
						</div>
					) : (
						<div className={styles['chord-card-sounds']} onClick={handleCollectionVisible}>
							<Icon name="icon-collection" size={16} />
						</div>
					)}
				</div>
			</div>

			{collectionVisible && (
				<CardCollector data={collectionData} onCancel={handleCollectionVisible} />
			)}
		</div>
	)
	return extra ? (
		<Portal triggerType="hover" trigger={card}>
			{extra}
		</Portal>
	) : (
		card
	)
})

export const DetailCard: FC<{ chordType?: BoardChord['chordType']; chord?: Tone[] }> = ({
	chordType,
}) => {
	const { boardOptions } = useBoardContext()
	const chordName = getBoardChordName(chordType, boardOptions)

	const notes = useMemo(() => {
		if (!chordType?.tone?.note || !chordType?.key) {
			return []
		}
		const offset = NOTE_LIST.indexOf(chordType.tone.note)
		const intervals = chordType.key
			.toString()
			.split('')
			.reduce((prev, str) => [...prev, Number(str) + prev[prev.length - 1]], [offset])
		return intervals.map((interval) => NOTE_LIST[interval % NOTE_LIST.length])
	}, [chordType])

	if (!chordType) {
		return null
	}

	const constitute = chordType.constitute
	const constituteTag = constitute?.map((item) => getDegreeTag(item))
	const chordList = constitute?.map((_, index) => {
		return {
			note: notes[index],
			degreeTag: constituteTag?.[index],
			degree: constitute?.[index],
		}
	})

	const title = chordType.name
	const subTitle = chordType.tag !== '*' ? chordType.name_zh : '自定义'
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
				{chordList?.length &&
					chordList.map(({ note, degree, degreeTag }, index) => (
						<div
							key={index}
							className={cx('buitar-primary-button', styles['detail-chord-note'], 'flex-center')}
						>
							<div className={styles['detail-chord-tag']}>{degreeTag}</div>
							<div className={styles['detail-chord-title']}>{note}</div>
							<div className={cx(styles['detail-chord-tag'], styles['detail-chord-tag__end'])}>
								{degree}
							</div>
						</div>
					))}
			</div>
		</div>
	)
}
