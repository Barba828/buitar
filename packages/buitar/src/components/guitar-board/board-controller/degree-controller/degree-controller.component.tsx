import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import {
	ProgressionItem,
	ProgressionsConfig,
} from '@/pages/chord-progressions/progressions.config'
import {
	ChordTagPicker,
	Icon,
	Modal,
	toast,
	useBoardContext,
	useConfigContext,
	usePlayerContext,
} from '@/components'
import { rootToChord, transChordTaps, DEGREE_TAG_LIST } from '@buitar/to-guitar'
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
	const [editProgression, setEditProgression] = useState<ProgressionsConfig>()
	const toggleExpande = () => {
		setExpand(!expand)
	}

	const toggleEdit = () => {
		setEdit(!edit)
	}

	const handleSubmit = () => {
		if (!editProgression) {
			return
		}
		const payload = [...progressions, editProgression]
		dispatchProgressions({ type: 'set', payload  })
		setProgressionIndex(payload.length - 1)
		toast('新增和弦进行' + editProgression.name)
		toggleEdit()
	}

	const handleEdit = (progression: ProgressionsConfig) => {
		setEditProgression(progression)
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
				className={cx('primary-button', styles['degree-item'])}
				onClick={() => {
					setExpand(false)
					setProgressionIndex(index)
				}}
			>
				{DEGREE_TAG_LIST[degree.name - 1]}
				<span className={styles['degree-item-tag']}>{degree.tag}</span>
			</div>
		))
		const expandBtns = expand && (
			<div
				className={cx('primary-button', styles['degree-btn'], styles['degree-remove'])}
				onClick={() => handleRemove(index)}
			>
				<Icon name="icon-close" />
			</div>
		)

		return (
			<div
				key={index}
				className={cx(
					'scroll-without-bar',
					styles['degree-view'],
					progressionIndex === index && styles['degree-view-checked']
				)}
			>
				{degreesView}
				{expandBtns}
			</div>
		)
	})

	const item = list[progressionIndex]

	return (
		<div className={styles['degree-controller']}>
			<Modal visible={edit} onCancel={toggleEdit} onConfirm={handleSubmit}>
				<DegreeEditor onChange={handleEdit} />
			</Modal>
			<div className={styles['degree-container']}>{expand ? list : item}</div>

			<div
				className={cx(
					'primary-button',
					styles['degree-btn'],
					expand && styles['icon-expand']
				)}
				onClick={toggleExpande}
			>
				<Icon name="icon-back" />
			</div>
			<div className={cx('primary-button', styles['degree-btn'])} onClick={toggleEdit}>
				<Icon name="icon-add" />
			</div>
		</div>
	)
}

const defaultTag = {
	name: 1,
	tag: '',
	beat: 1,
}

export const DegreeEditor: FC<{
	onChange: (x: ProgressionsConfig) => void
}> = ({ onChange }) => {
	const [procession, setProcession] = useState<ProgressionItem[]>([{ ...defaultTag }])
	const [checkedIndex, setCheckedIndex] = useState<number>(procession.length - 1)
	const [processionName, setProcessionName] = useState<string>('')
	const { isHoverDevice } = useConfigContext()

	useEffect(() => {
		onChange({
			procession: procession,
			name: processionName,
			introduction: '',
		})
	}, [procession, processionName])

	const handleAdd = useCallback(() => {
		procession.push({ ...defaultTag })
		setCheckedIndex(procession.length - 1)
		setProcession([...procession])
	}, [procession])

	const handleRemove = (index: number) => {
		procession.splice(index, 1)
		if (index === checkedIndex) {
			setCheckedIndex(procession.length - 1)
		}
		setProcession([...procession])
	}

	const handleCheckTag = useCallback(
		(tag: string) => {
			procession[checkedIndex].tag = tag
			setProcession([...procession])
		},
		[procession, checkedIndex]
	)

	const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
		setProcessionName(e.target.value)
	}

	return (
		<div className={cx(styles['degree-container'])}>
			{/* 选中的级数列表 */}
			<div className={cx('scroll-without-bar', styles['degree-view'])}>
				{procession.map((degree, index) => (
					<div
						key={index}
						className={cx(
							'primary-button',
							styles['degree-item'],
							index === checkedIndex && 'touch-yellow'
						)}
						onClick={() => setCheckedIndex(index)}
					>
						{DEGREE_TAG_LIST[degree.name - 1]}
						<span className={styles['degree-item-tag']}>{degree.tag}</span>
						{/* hover删除按钮 */}
						{isHoverDevice && (
							<div
								onClick={() => {
									handleRemove(index)
								}}
								className={cx(styles['degree-item-remove'])}
							>
								<Icon name="icon-close" />
							</div>
						)}
					</div>
				))}

				{/* 级数操作按钮s */}
				<div className={cx('primary-button', styles['degree-btn'])} onClick={handleAdd}>
					<Icon name="icon-add" size={24} />
				</div>
				<div
					className={cx('primary-button', styles['degree-btn'])}
					onClick={() => handleRemove(checkedIndex)}
				>
					<Icon name="icon-delete" size={24} />
				</div>
			</div>

			{/* 可选级数列表 */}
			<div className={cx('scroll-without-bar', styles['degree-view'])}>
				{DEGREE_TAG_LIST.map((degree, index) => (
					<div
						key={index}
						onClick={() => {
							procession[checkedIndex].name = index + 1
							setProcession([...procession])
						}}
						className={cx(
							'primary-button',
							styles['degree-item'],
							styles['degree-item-second']
						)}
					>
						{degree}
					</div>
				))}
			</div>

			{/* 和弦类型 */}
			<ChordTagPicker onChange={handleCheckTag} tag={procession?.[checkedIndex]?.tag} />

			<input
				placeholder={'和弦进行名称'}
				onChange={handleChangeName}
				className={cx('primary-button', 'text-input', styles['degree-input'])}
			></input>
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
		boardSettings: { isSharpSemitone },
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
			const chord = rootToChord(tone.note, degree.tag)!
			return {
				...chord,
				tone,
				degree: DEGREE_TAG_LIST[degree.name - 1],
			}
		})
	}, [guitarBoardOption.chords])

	useEffect(() => {
		const soundList = chords.map((item) => {
			return transChordTaps(item.chord, guitarBoardOption)[0].chordTaps
		})
		setSoundList(soundList)
	}, [guitarBoardOption.chords])

	const handleClick = useCallback(
		(item, index) => {
			// 点击相同的级数和弦，收起指法列表
			if (index === soundListIndex) {
				setSoundListIndex(-1)
				setChordTaps([])
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
