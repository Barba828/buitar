import React, { FC, useMemo, useState, memo, useCallback } from 'react'
import { useBoardContext } from '../../board-provider'
import { SvgChord, transToSvgPoints } from '@/components/svg-chord'
import { Icon } from '@/components/icon'
import { Portal } from '@/components'
import { BoardChord, NOTE_LIST, Point, toDegreeTag, intervalToSemitones } from '@buitar/to-guitar'
import { CardCollector } from './card-collector.component'
import { CardDownloader } from './card-downloader.component'
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
	const {
		player,
		guitarBoardOption: { keyboard },
	} = useBoardContext()
	const [collectionVisible, setCollectionVisible] = useState(false)
	const [downloadVisible, setDownloadVisible] = useState(false)

	const cls = cx('primary-button', styles['chord-card'], className, taps.length === 0 && styles['chord-card-hidden'])

	const svgPoints = useMemo(() => transToSvgPoints(taps, keyboard?.length), [taps])

	const handleClick = useCallback(() => {
		player.triggerPointArpeggio(taps)
	}, [taps])

	const handleSoundClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		e.stopPropagation()
		player.triggerPointRelease(taps)
	}

	const toggleDownloadVisible = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		e.stopPropagation()
		setDownloadVisible(!downloadVisible)
	}
	const toggleCollectionVisible = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		e.stopPropagation()
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

	const svgData = {
		points: svgPoints,
		size,
		title,
	}

	const card = (
		<div className={styles.container}>
			<div onClick={handleClick} className={cls} style={{ width: size * 1.2, height: size * 1.2 }}>
				<SvgChord {...svgData} />
				<div className={styles['chord-card-dot']} />
				<div className={styles['chord-card-icons']}>
					{/* 琶音 */}
					<div className={styles['chord-card-sounds']} onClick={handleSoundClick}>
						<Icon name="icon-eighth-note" size={16} />
					</div>

					{/* 收藏/移除收藏 */}
					{disableCollect ? null : onRemoveCollection ? (
						<div className={styles['chord-card-sounds']} onClick={handleRemoveCollection}>
							<Icon name="icon-delete" size={16} />
						</div>
					) : (
						<div className={styles['chord-card-sounds']} onClick={toggleCollectionVisible}>
							<Icon name="icon-collection" size={16} />
						</div>
					)}

					{/* 下载 */}
					<div className={styles['chord-card-sounds']} onClick={toggleDownloadVisible}>
						<Icon name="icon-download" size={16} />
					</div>
				</div>
			</div>

			<CardCollector visible={collectionVisible} data={collectionData} onCancel={toggleCollectionVisible} />
			<CardDownloader visible={downloadVisible} onCancel={toggleDownloadVisible} {...svgData} />
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

export const DetailCard: FC<{ chordType?: BoardChord['chordType'] }> = memo(({ chordType }) => {
	const { guitarBoardOption } = useBoardContext()
	const chordName = getBoardChordName(chordType, guitarBoardOption)

	if (!chordType) {
		return null
	}

	const offset = chordType.tone || 0
	const constitute = chordType.constitute
	const constituteTag = constitute?.map((item) => toDegreeTag(item))
	const chordList = constitute?.map((pitch, index) => {
		const noteIndex = (offset + intervalToSemitones(pitch)) % NOTE_LIST.length
		return {
			note: guitarBoardOption.notesOnC?.[noteIndex],
			degreeTag: constituteTag?.[index],
			degree: constitute?.[index],
		}
	})

	const title = chordType.name
	const subTitle = chordType.tag !== '*' ? chordType.name_zh : '自定义'
	return (
		<div className={cx(styles['detail-card'])}>
			<div className={cx('primary-button', styles['detail-view'])}>
				<div className={styles['detail-title']}>{chordName}</div>
				<div className={styles['detail-name']}>
					{title}
					<div className={styles['detail-subname']}>{subTitle}</div>
				</div>
			</div>
			<div className={styles['detail-chord']}>
				{chordList?.length &&
					chordList.map(({ note, degree, degreeTag }, index) => (
						<div key={index} className={cx('primary-button', styles['detail-chord-note'], 'flex-center')}>
							<div className={styles['detail-chord-tag']}>{degreeTag}</div>
							<div className={styles['detail-chord-title']}>{note}</div>
							<div className={cx(styles['detail-chord-tag'], styles['detail-chord-tag__end'])}>{degree}</div>
						</div>
					))}
			</div>
		</div>
	)
})
