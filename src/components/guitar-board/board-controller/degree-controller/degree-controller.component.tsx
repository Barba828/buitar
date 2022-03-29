import React, { FC, useCallback, useEffect, useState } from 'react'
import { degreeList } from '@/pages/chord-progressions/progressions.config'
import cx from 'classnames'
import styles from './degree-controller.module.scss'
import {
	ControllerList,
	ControllerProps,
	Icon,
	useBoardContext,
	usePlayerContext,
} from '@/components'
import { transChord, transChordTaps } from 'to-guitar'

/**
 * 级数选择器
 * @returns
 */
export const DegreeController = () => {
	const { progressionIndex, setProgressionIndex, progressions } = usePlayerContext()
	const [expand, setExpand] = useState(false)
	const handleExpande = () => {
		setExpand(!expand)
	}

	const list = progressions.map((progress, index) => {
		const degreesView = progress.procession.map((degree, degreeIndex) => (
			<div
				key={degreeIndex}
				className={cx('buitar-primary-button', styles['degree-item'])}
				onClick={() => {
					setExpand(false)
					setProgressionIndex(index)
				}}
			>
				{degreeList[degree.name - 1]}
				{degree.tag}
			</div>
		))

		return (
			<div
				key={index}
				className={cx(
					styles['degree-view'],
					progressionIndex === index && styles['degree-view-checked']
				)}
			>
				{degreesView}
			</div>
		)
	})

	const item = list[progressionIndex]

	return (
		<div className={styles['degree-controller']}>
			<div
				className={cx(
					'buitar-primary-button',
					styles['degree-expand'],
					expand && styles['icon-expand']
				)}
				onClick={handleExpande}
			>
				<Icon name="icon-back" />
			</div>
			<div className={styles['degree-container']}>{expand ? list : item}</div>
			<div className={cx('buitar-primary-button', styles['degree-add'])}>
				<Icon name="icon-add" />
			</div>
		</div>
	)
}

/**
 * 级数和弦选择器
 * @returns
 */
export const DegreeChordController: FC<ControllerProps> = () => {
	const {
		guitarBoardOption,
		setChord,
		boardOptions: { isSharpSemitone },
	} = useBoardContext()
	const { progressions, progressionIndex, setSoundList, setSoundListIndex } = usePlayerContext()

	const tones = guitarBoardOption.chords?.map((chord) => chord.tone)
	const chords = progressions[progressionIndex].procession.map((degree) => {
		const tone = tones![degree.name - 1]
		const chord = transChord(tone.note, degree.tag)!
		return {
			...chord,
			tone,
			degree: degreeList[degree.name - 1],
		}
	})
	const soundList = chords.map((item) => {
		return transChordTaps(item.chord, guitarBoardOption.keyboard).chordList[0]
	})

	useEffect(() => {
		setSoundList(soundList)
	}, [guitarBoardOption.chords])

	const handleClick = useCallback(
		(item, index) => {
			setChord(item.chord)
			setSoundListIndex(index)
		},
		[setChord, setSoundListIndex]
	)

	return (
		<ControllerList
			list={chords}
			onClickItem={handleClick}
			renderListItem={(item) => {
				return (
					<div className={styles['chord-item']}>
						<div className={styles['chord-item-grade']}>{item.degree}</div>
						<div>
							<span className={styles['chord-item-note']}>
								{isSharpSemitone ? item.tone.note : item.tone.noteFalling}
							</span>
							<span className={styles['chord-item-tag']}>{item.chordType.tag}</span>
						</div>
						<div className={styles['chord-item-name']}>{item.chordType.name_zh}</div>
					</div>
				)
			}}
			className={styles['chord-list']}
			checkedItem={() => true}
		/>
	)
}
