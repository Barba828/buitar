import { FC, useCallback, useEffect, useState } from 'react'
import { DegreeChord, chordDegreeMap, ChordDegreeNum, rootToChord, toDegreeTag } from '@buitar/to-guitar'
import { useBoardContext, ChordTapsController } from '@/components/guitar-board'
import { FifthCircleController } from '../fifth-circle-controller'
import { tagList, tagTypedList } from '@/pages/chord-progressions/progressions.config'
import { chordControllConfig } from './chord-controll.config'
import { TabSwitch } from '@/components/ui'
import { ControllerList, ControllerListProps } from '@/components/controller'
import cx from 'classnames'

import styles from './chord-controller.module.scss'
import { Link } from 'react-router-dom'
import { useRouteFind } from '@/utils/hooks/use-routers'

export const ChordController: FC = (props) => {
	const [tabIndex, setTabIndex] = useState(0)
	const { taps } = useBoardContext()
	const chordAnalyzerRoute = useRouteFind('ChordAnalyzer')

	return (
		<>
			<div className={styles['chord-switch']}>
				<TabSwitch
					className={cx(styles['chord-tab'])}
					values={chordControllConfig}
					defaultValue={chordControllConfig[tabIndex]}
					onChange={(_value, index) => {
						setTabIndex(index)
					}}
					renderItem={(item) => item.name_zh}
				/>
				{taps.length > 0 && (
					<Link
						to={chordAnalyzerRoute.path}
						state={{ taps }}
						className={cx('primary-button', styles['chord-switch-item'])}
					>
						前往编辑
					</Link>
				)}
			</div>
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
export const ChordControllerInner: FC<{ left?: JSX.Element; minor?: boolean }> = ({ left, minor, children }) => {
	return (
		<>
			<div className={styles['container']}>
				{left ? left : <FifthCircleController minor={minor} className={styles['fifth-circle']} />}
				<div className={styles['chord-controllers']}>{children}</div>
			</div>
		</>
	)
}

/**
 * 和弦类型选择器
 */
const ChordTypePicker = () => {
	const { guitarBoardOption, setChord } = useBoardContext()
	const [type, setType] = useState('')

	useEffect(() => {
		/**
		 * 五度圈选择器中已经设置了scale调式，和弦的显示通过scale调式决定
		 * 这里和弦音Note和Scale调式是一个，根据类型来选择永远都是一级和弦，所以这里获取和弦半音程直接 on C 获取
		 */
		const _chord = rootToChord('C', type)
		if (!_chord) {
			return
		}
		setChord(_chord.chord)
	}, [type, guitarBoardOption.scale])

	return <ChordTagPicker onChange={setType} tag={type} />
}

/**
 * 和弦Tag类型选择器
 * @todo 类型tab不合理
 */
export const ChordTagPicker: FC<{ onChange(tag: string): void; tag?: string }> = ({ onChange, tag }) => {
	const [list, setList] = useState(tagList)
	const tabQuery = ['all', '3', '7', '9', 'm', 'maj', 'sus', 'aug']
	const defaultQuery = '3'

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

	useEffect(() => {
		handleChangeQuery(defaultQuery)
	}, [])

	return (
		<>
			<TabSwitch
				className={styles['chord-type-tabs']}
				values={tabQuery}
				defaultValue={defaultQuery}
				onChange={handleChangeQuery}
			></TabSwitch>
			<div className={cx(styles['chord-type'], 'scroll-without-bar')}>
				{list.map((tagItem) => (
					<div
						key={tagItem}
						onClick={() => onChange(tagItem)}
						className={cx('primary-button', styles['tags-item'], tag === tagItem && 'touch-yellow')}
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
						<span className={styles['scale-item-mode']}>{chordDegreeMap.get(item)?.name.split(' ')[0]}</span>
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
const ChordPickerController: FC<ControllerListProps<DegreeChord>> = ({ ...props }) => {
	const { chord, setChord, guitarBoardOption } = useBoardContext()

	const handleClick = useCallback((item: DegreeChord) => {
		setChord(item.chord.map((degree) => degree.interval))
	}, [])

	return (
		<ControllerList
			{...props}
			list={guitarBoardOption.chords || []}
			onClickItem={handleClick}
			renderListItem={(item) => <DegreeChordItem item={item} />}
			checkedItem={(item) => item.chord[0].interval === chord[0]}
		/>
	)
}

export const DegreeChordItem: FC<{ item: DegreeChord; withtag?: boolean }> = ({ item, withtag = true }) => {
	return (
		<div className={styles['chord-item']}>
			<div className={styles['chord-item-grade']}>{toDegreeTag(item.degreeNum)}</div>
			<span className={styles['chord-item-note']}>{item.note}</span>
			{withtag && <span className={styles['chord-item-tag']}>{item.chordType?.[0]?.tag}</span>}
			<div className={styles['chord-item-scale']}>{item.scale}</div>
		</div>
	)
}
