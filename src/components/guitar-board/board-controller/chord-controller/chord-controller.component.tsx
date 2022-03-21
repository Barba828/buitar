import React, { FC, useCallback, useState } from 'react'
import { ControllerList } from '../controller'
import {
	Chord,
	chordDegreeMap,
	ChordDegreeNum,
	ModeType,
	MODE_LIST,
	Tone,
	transNote,
} from 'to-guitar'
import { ControllerProps } from '../option-controller'
import { useBoardContext, getBoardOptionsList } from '../../index'
import styles from './chord-controller.module.scss'

export const ChordController: FC<ControllerProps> = (props) => {
	return (
		<>
			<div className={styles['container']}>
				<ModePickerController {...props} />
				<ScalePickerController {...props} />
				<ChordNumPickerController {...props} />
			</div>
			<div className={styles['container']}>
				<ChordPickerController {...props} />
			</div>
		</>
	)
}

/**
 * 调式选项 => guitarBoardOption.mode
 * @param props
 * @returns
 */
const ModePickerController: FC<ControllerProps> = (props) => {
	const { guitarBoardOption, guitar } = useBoardContext()

	const handleClick = useCallback(
		(mode: ModeType) => {
			guitar.setOptions({ mode })
		},
		[guitar]
	)

	const checked = (item: ModeType) => item === guitarBoardOption.mode

	return (
		<ControllerList
			{...props}
			list={MODE_LIST}
			onClickItem={handleClick}
			renderListItem={(item) => {
				return <div className={styles['mode-item']}>{item}</div>
			}}
			checkedItem={checked}
		/>
	)
}

/**
 * 音阶选项 => guitarBoardOption.scale
 * @param props
 * @returns
 */
const ScalePickerController: FC<ControllerProps> = (props) => {
	const { boardOptions, guitarBoardOption, guitar } = useBoardContext()
	const tones = getBoardOptionsList(boardOptions, guitarBoardOption.mode)

	const handleClick = useCallback(
		(tone: Tone) => {
			guitar.setOptions({ scale: tone })
		},
		[guitar]
	)

	const checked = (item: Tone) => transNote(item) === transNote(guitarBoardOption.scale || 'C')

	return (
		<ControllerList
			{...props}
			list={tones}
			onClickItem={handleClick}
			renderListItem={(item) => {
				return (
					<div className={styles['scale-item']}>
						{item}
						{checked(item) && (
							<span className={styles['scale-item-mode']}>{guitarBoardOption.mode}</span>
						)}
					</div>
				)
			}}
			checkedItem={checked}
		/>
	)
}

/**
 * 和弦类型选项 => guitarBoardOption.chordNumType
 * @param props
 * @returns
 */
const ChordNumPickerController: FC<ControllerProps> = (props) => {
	const { guitarBoardOption, guitar } = useBoardContext()

	const handleClick = useCallback(
		(chordNumType: ChordDegreeNum) => {
			guitar.setOptions({ chordNumType })
		},
		[guitar]
	)

	const checked = (chordNumType: ChordDegreeNum) => chordNumType === guitarBoardOption.chordNumType

	return (
		<ControllerList
			{...props}
			list={Array.from(chordDegreeMap.keys())}
			onClickItem={handleClick}
			renderListItem={(item) => {
				return (
					<div className={styles['scale-item']}>
						{item}
						<span className={styles['scale-item-mode']}>
							{chordDegreeMap.get(item)?.name.split(' ')[0]}
						</span>
					</div>
				)
			}}
			checkedItem={checked}
		/>
	)
}

/**
 * 调内顺阶和弦选项 => chord
 * @param props
 * @returns
 */
const ChordPickerController: FC<ControllerProps> = ({ ...props }) => {
	const {
		chord,
		setChord,
		guitarBoardOption,
		boardOptions: { isSharpSemitone },
	} = useBoardContext()

	const handleClick = useCallback((item: Chord) => {
		setChord(item.chord)
	}, [])

	return (
		<ControllerList
			{...props}
			list={guitarBoardOption.chords || []}
			onClickItem={handleClick}
			renderListItem={(item) => {
				return (
					<div className={styles['chord-item']}>
						<div className={styles['chord-item-grade']}>{item.degree.tag}</div>
						<span className={styles['chord-item-note']}>
							{isSharpSemitone ? item.tone.note : item.tone.noteFalling}
						</span>
						<span className={styles['chord-item-tag']}>{item.chordType?.[0].tag}</span>
						<div className={styles['chord-item-scale']}>{item.degree.scale}</div>
					</div>
				)
			}}
			checkedItem={(item) => item.chord === chord}
			visibleItem={() => true}
		/>
	)
}
