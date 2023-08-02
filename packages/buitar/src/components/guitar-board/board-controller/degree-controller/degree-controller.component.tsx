import  { FC, useCallback, useEffect, useMemo, useState } from 'react'
import {
	ProgressionItem,
	ProgressionsConfig,
	tagList,
} from '@/pages/chord-progressions/progressions.config'
import {
	Icon,
	useBoardContext,
	usePlayerContext,
} from '@/components'
import { transChord, transChordTaps, DEGREE_TAG_LIST } from '@buitar/to-guitar'
import { ControllerList, ControllerListProps } from '@/components/controller'
import cx from 'classnames'

import styles from './degree-controller.module.scss'

/**
 * 级数选择器
 * @returns
 */
export const DegreeController = () => {
	const { progressionIndex, setProgressionIndex, progressions, dispatchProgressions } =
		usePlayerContext()
	const [expand, setExpand] = useState(false)
	const [edit, setEdit] = useState(false)
	const toggleExpande = () => {
		setExpand(!expand)
	}

	const toggleEdit = () => {
		setEdit(!edit)
	}

	const handleSubmit = (progression: ProgressionsConfig) => {
		dispatchProgressions({ type: 'set', payload: [...progressions, progression] })
		setProgressionIndex(progressions.length)
	}

	const handleRemove = (index: number) => {
		progressions.splice(index, 1)
		dispatchProgressions({ type: 'set', payload: [...progressions] })
		setProgressionIndex(progressions.length - 1)
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
				{DEGREE_TAG_LIST[degree.name - 1]}
				<span className={styles['degree-item-tag']}>{degree.tag}</span>
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
				<div
					className={cx('buitar-primary-button', styles['degree-add'], styles['degree-remove'])}
					onClick={() => handleRemove(index)}
				>
					<Icon name="icon-close" />
				</div>
			</div>
		)
	})

	const item = list[progressionIndex]

	return (
		<div className={styles['degree-controller']}>
			{edit ? (
				<>
					<DegreeEditor onClose={toggleEdit} onSubmit={handleSubmit} />
				</>
			) : (
				<>
					<div
						className={cx(
							'buitar-primary-button',
							styles['degree-expand'],
							expand && styles['icon-expand']
						)}
						onClick={toggleExpande}
					>
						<Icon name="icon-back" />
					</div>
					<div className={styles['degree-container']}>{expand ? list : item}</div>
					<div className={cx('buitar-primary-button', styles['degree-add'])} onClick={toggleEdit}>
						<Icon name="icon-add" />
					</div>
				</>
			)}
		</div>
	)
}

const defaultTag = {
	name: 1,
	tag: '',
	beat: 1,
}

export const DegreeEditor: FC<{
	onClose: () => void
	onSubmit: (x: ProgressionsConfig) => void
}> = ({ onClose, onSubmit }) => {
	const [procession, setProcession] = useState<ProgressionItem[]>([{ ...defaultTag }])
	const [checked, setChecked] = useState<number>(procession.length - 1)

	const handleAdd = useCallback(() => {
		procession.push({ ...defaultTag })
		setChecked(procession.length - 1)
		setProcession([...procession])
	}, [procession])

	const handleSubmit = useCallback(() => {
		onSubmit({
			procession: procession,
			name: '',
			introduction: '',
		})
		onClose()
	}, [procession])

	const handleRemove = (index: number) => {
		procession.splice(index, 1)
		setProcession([...procession])
	}

	return (
		<div className={styles['degree-container']}>
			<div className={styles['degree-view']}>
				{procession.map((degree, index) => (
					<div
						key={index}
						className={cx(
							'buitar-primary-button',
							styles['degree-item'],
							index === checked && 'touch-yellow'
						)}
						onClick={() => setChecked(index)}
					>
						{DEGREE_TAG_LIST[degree.name - 1]}
						<span className={styles['degree-item-tag']}>{degree.tag}</span>
						<div
							onClick={() => {
								handleRemove(index)
							}}
							className={cx(styles['degree-item-remove'])}
						>
							<Icon name="icon-close" />
						</div>
					</div>
				))}
				<div className={cx('buitar-primary-button', styles['degree-add'])} onClick={handleAdd}>
					<Icon name="icon-add" size={24} />
				</div>

				<div className={cx('buitar-primary-button', styles['degree-add'])} onClick={handleSubmit}>
					<Icon name="icon-confirm" />
				</div>
				<div className={cx('buitar-primary-button', styles['degree-add'])} onClick={onClose}>
					<Icon name="icon-close" />
				</div>
			</div>

			<div className={styles['degree-view']}>
				{DEGREE_TAG_LIST.map((degree, index) => (
					<div
						key={index}
						onClick={() => {
							procession[checked].name = index + 1
							setProcession([...procession])
						}}
						className={cx(
							'buitar-primary-button',
							styles['degree-item'],
							styles['degree-item-second']
						)}
					>
						{degree}
					</div>
				))}
			</div>

			<div className={cx(styles['degree-view'], styles['tags-view'])}>
				{tagList.map((tag) => (
					<div
						key={tag}
						onClick={() => {
							procession[checked].tag = tag
							setProcession([...procession])
						}}
						className={cx('buitar-primary-button', styles['tags-item'])}
					>
						{tag}
					</div>
				))}
			</div>
		</div>
	)
}

/**
 * 级数和弦选择器
 * @returns
 */
export const DegreeChordController: FC<ControllerListProps<any>> = () => {
	const {
		guitarBoardOption,
		setChord,
		setChordTaps,
		boardOptions: { isSharpSemitone },
	} = useBoardContext()
	const { progressions, progressionIndex, soundListIndex, setSoundList, setSoundListIndex } =
		usePlayerContext()

	const chords = useMemo(() => {
		if (!progressions[progressionIndex]) {
			return []
		}
		const tones = guitarBoardOption.chords?.map((chord) => chord.tone)
		return progressions[progressionIndex].procession.map((degree) => {
			const tone = tones![degree.name - 1]
			const chord = transChord(tone.note, degree.tag)!
			return {
				...chord,
				tone,
				degree: DEGREE_TAG_LIST[degree.name - 1],
			}
		})
	}, [guitarBoardOption.chords])

	useEffect(() => {
		const soundList = chords.map((item) => {
			return transChordTaps(item.chord, guitarBoardOption.keyboard).chordList[0]
		})
		setSoundList(soundList)
	}, [guitarBoardOption.chords])

	const handleClick = useCallback(
		(item, index) => {
			// 点击相同的级数和弦，收起指法列表
			if (index === soundListIndex) {
				setSoundListIndex(-1)
				setChordTaps(null)
				return
			}

			setChord(item.chord)
			setSoundListIndex(index)
		},
		[setChord, setSoundListIndex, soundListIndex]
	)

	if (!progressions[progressionIndex] || progressionIndex < 0) {
		return null
	}

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
