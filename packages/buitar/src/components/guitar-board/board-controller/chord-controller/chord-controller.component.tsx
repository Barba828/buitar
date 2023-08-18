import { FC, useCallback, useEffect, useState } from 'react'
import { Chord, chordDegreeMap, ChordDegreeNum, transChord, getDegreeTag } from '@buitar/to-guitar'
import { useBoardContext, ChordTapsController } from '@/components/guitar-board'
import { FifthCircleController } from '../fifth-circle-controller'
import { tagList, tagTypedList } from '@/pages/chord-progressions/progressions.config'
import { chordControllConfig } from './chord-controll.config'
import { TabSwitch } from '@/components/ui'
import { ControllerList, ControllerListProps } from '@/components/controller'
import cx from 'classnames'

import styles from './chord-controller.module.scss'

export const ChordController: FC = (props) => {
	const [tabIndex, setTabIndex] = useState(0)

	return (
		<>
			<TabSwitch
				className={cx(styles['chord-tab'])}
				values={chordControllConfig}
				defaultValue={chordControllConfig[tabIndex]}
				onChange={(value, index) => {
					setTabIndex(index)
				}}
				renderTabItem={(item) => item.name_zh}
			/>
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

	return <ChordTagPicker onChange={setType} tag={type} />
}

export const ChordTagPicker: FC<{ onChange(tag: string): void; tag?: string }> = ({
	onChange,
	tag,
}) => {
	const [list, setList] = useState(tagList)
	const tabQuery = ['all', '3', '7', '9', 'm', 'maj', 'sus', 'aug']

	const handleChangeQuery = useCallback((query: string) => {
		let tempList = tagList
		switch (query) {
			case 'all':
				/**do nothing */
				break
			case 'm':
				tempList = tagList.filter((tag) => tag.includes('m') && !tag.includes('maj'))
				break
			case '3':
				tempList = tagTypedList[0]
				break
			case '7':
				tempList = tagTypedList[1]
				break
			case '9':
				tempList = tagTypedList[2]
				break
			default:
				tempList = tagList.filter((tag) => tag.includes(query))
				break
		}
		setList(tempList)
		return
	}, [])
	return (
		<>
			<TabSwitch
				className={styles['chord-type-tabs']}
				values={tabQuery}
				onChange={handleChangeQuery}
			></TabSwitch>
			<div className={styles['chord-type']}>
				{list.map((tagItem) => (
					<div
						key={tagItem}
						onClick={() => onChange(tagItem)}
						className={cx(
							'buitar-primary-button',
							styles['tags-item'],
							tag === tagItem && 'touch-yellow'
						)}
					>
						{tagItem}
					</div>
				))}
			</div>
		</>
	)
}

/**
 * 和弦类型选项 => guitarBoardOption.chordNumType
 * @param props
 * @returns
 */
const ChordNumPickerController: FC<ControllerListProps<ChordDegreeNum>> = (props) => {
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
const ChordPickerController: FC<ControllerListProps<Chord>> = ({ ...props }) => {
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
			renderListItem={(item) => <DegreeChordItem item={item} isSharpSemitone={isSharpSemitone}/>}
			checkedItem={(item) => item.chord === chord}
		/>
	)
}

export const DegreeChordItem: FC<{ item: Chord; isSharpSemitone?: boolean; withtag?: boolean }> = ({
	item,
	isSharpSemitone = true,
	withtag = true,
}) => {
	return (
		<div className={styles['chord-item']}>
			<div className={styles['chord-item-grade']}>{getDegreeTag(item.degree.degreeNum)}</div>
			<span className={styles['chord-item-note']}>
				{isSharpSemitone ? item.tone.note : item.tone.noteFalling}
			</span>
			{withtag && <span className={styles['chord-item-tag']}>{item.chordType?.[0]?.tag}</span>}
			<div className={styles['chord-item-scale']}>{item.degree.scale}</div>
		</div>
	)
}
