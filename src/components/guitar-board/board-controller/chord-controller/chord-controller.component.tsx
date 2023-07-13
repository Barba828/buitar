import React, { FC, memo, useCallback, useEffect, useState } from 'react'
import { ControllerList } from '../controller'
import { Chord, chordDegreeMap, ChordDegreeNum, transChord, getDegreeTag } from '@to-guitar'
import { ControllerProps } from '../option-controller'
import { useBoardContext, ChordTapsController } from '../../index'
import { FifthCircleController } from '../fifth-circle-controller'
import { tagList } from '@/pages/chord-progressions/progressions.config'
import cx from 'classnames'

import styles from './chord-controller.module.scss'
import { chordControllConfig } from './chord-controll.config'

export const ChordController: FC<ControllerProps> = (props) => {
	const [tabIndex, setTabIndex] = useState(0)

	const ChordCheckerTab = memo(() => {
		return (
			<div className={cx(styles['chord-tab'])}>
				{chordControllConfig.map((item, index) => (
					<div
						key={index}
						className={cx(
							'buitar-primary-button',
							styles['chord-tab-item'],
							tabIndex === index && 'touch-yellow'
						)}
						onClick={() => {
							setTabIndex(index)
						}}
					>
						{item.name_zh}
					</div>
				))}
			</div>
		)
	})
	return (
		<>
			<ChordCheckerTab />
			{tabIndex === 0 ? (
				<ChordControllerInner>
					<ChordNumPickerController {...props} />
					<ChordPickerController {...props} />
					<ChordTapsController {...props} />
				</ChordControllerInner>
			) : (
				<ChordControllerInner minor={false}>
					<ChordTypePicker />
					<ChordTapsController {...props} />
				</ChordControllerInner>
			)}
		</>
	)
}

/**
 * 左侧五度圈的选择器
 * @returns
 */
export const ChordControllerInner: FC<{ left?: JSX.Element; minor?: boolean }> = ({
	left,
	minor,
	children,
}) => {
	return (
		<>
			<div className={styles['container']}>
				{left ? left : <FifthCircleController minor={minor} className={styles['fifth-circle']} />}
				<div className={styles['chord-controllers']}>{children}</div>
			</div>
		</>
	)
}

const ChordTypePicker = () => {
	const { guitarBoardOption, setChord } = useBoardContext()
	const [type, setType] = useState('')

	useEffect(() => {
		if (!guitarBoardOption.scale) {
			return
		}
		const _chord = transChord(guitarBoardOption.scale, type)
		if (!_chord) {
			return
		}
		setChord(_chord.chord)
	}, [type, guitarBoardOption.scale])

	return (
		<div className={styles['chord-type']}>
			{tagList.map((tag) => (
				<div
					key={tag}
					onClick={() => setType(tag)}
					className={cx(
						'buitar-primary-button',
						styles['tags-item'],
						tag === type && 'touch-yellow'
					)}
				>
					{tag}
				</div>
			))}
		</div>
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
			visibleItem={() => true}
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
						<div className={styles['chord-item-grade']}>{getDegreeTag(item.degree.degreeNum)}</div>
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
