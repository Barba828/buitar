import React, { FC, useEffect, useState } from 'react'
import { BoardProvider, GuitarBoard, useBoardContext } from '@/components/guitar-board'
import { RangeInput, TabSwitch, RangeSlider, usePagesIntro } from '@/components'
import type { RangeSliderProps } from '@/components'
import { Point, getModeFregTaps, getModeRangeTaps } from '@to-guitar'
import { ToneModeController } from '@/components/guitar-board/board-controller/tone-mode-controller/tone-mode-controller.component'
import cx from 'classnames'

import styles from './guitar-tableture.module.scss'

export const GuitarTableture: FC = () => {
	const intro = usePagesIntro()
	const [tabIndex, setTabIndex] = useState(1)
	const tabList = ['查询根音', '固定区域']

	return (
		<BoardProvider>
			{intro}
			<TabSwitch
				className={cx(styles['tableture-tab'])}
				values={tabList}
				defaultValue={tabList[tabIndex]}
				onChange={(value, index) => {
					setTabIndex(index)
				}}
			/>
			{tabIndex === 0 && <TapedGuitarBoardTableture />}
			{tabIndex === 1 && <GuitarBoardTabletureList />}
		</BoardProvider>
	)
}

/**
 * 点击获取该位置的任一指型
 * @returns
 */
const TapedGuitarBoardTableture = () => {
	const { setTaps, setHighFixedTaps, guitarBoardOption } = useBoardContext()
	const [isUp, setIsUp] = useState(false) // 是否上行音阶指型
	const [rootPoint, setRootPoint] = useState<Point>() // 根音

	const handleCheckedPoint = (points: Point[]) => {
		if (!points) {
			return
		}
		setRootPoint(points[0])
	}

	// 监听变化，更改指型
	useEffect(() => {
		if (!rootPoint) {
			return
		}
		const fregTaps = getModeFregTaps(rootPoint, guitarBoardOption.keyboard, guitarBoardOption.mode)
		const taps = isUp ? fregTaps.up : fregTaps.down
		const highFixedTaps = taps.filter((tap) => tap.tone === rootPoint.tone)
		// 设置指位
		setTaps(taps)
		// 设置根音高亮
		setHighFixedTaps(highFixedTaps)
	}, [rootPoint, isUp, guitarBoardOption.mode])

	return (
		<>
			<ToneModeController />
			<TabSwitch
				values={['上行', '下行']}
				defaultValue={'下行'}
				onChange={(value) => {
					setIsUp(value === '上行')
				}}
			/>
			<GuitarBoard onCheckedPoints={handleCheckedPoint} />
		</>
	)
}

/**
 * 获取某和弦匹配的指型
 */
const GuitarBoardTabletureList = () => {
	const { guitarBoardOption, setTaps, setHighFixedTaps } = useBoardContext()
	const [range, setRange] = useState<[number, number]>([0, 5])

	const [rootPoint, setRootPoint] = useState<Point>() // 根音

	const handleCheckedPoint = (points: Point[]) => {
		if (!points) {
			return
		}
		setRootPoint(points[0])
	}

	// 监听变化，更改指型
	useEffect(() => {
		if (!rootPoint) {
			return
		}
		const taps = getModeRangeTaps(
			rootPoint,
			guitarBoardOption.keyboard,
			guitarBoardOption.mode,
			range
		)
		const highFixedTaps = taps.filter((tap) => tap.tone === rootPoint.tone)
		// 设置指位
		setTaps(taps)
		// 设置根音高亮
		setHighFixedTaps(highFixedTaps)
	}, [rootPoint, range, guitarBoardOption.mode])

	return (
		<>
			<div className={cx(styles['tableture-list-options'])}>
				<div className={cx('buitar-primary-button')}>7</div>
				<div className={cx(styles['tableture-options-range'], 'buitar-primary-button')}>
					品数范围{range[0]} - {range[1]}
				</div>
			</div>
			<GuitarRangeSlider onChange={setRange} />
			<ToneModeController />

			<GuitarBoard range={[range[0] + 1, range[1] + 1]} onCheckedPoints={handleCheckedPoint} />
		</>
	)
}

const GuitarRangeSlider = ({ onChange }: Pick<RangeSliderProps, 'onChange'>) => {
	const [size, setSize] = useState(5)
	return (
		<>
			<div className={cx(styles['guitar-size-slider'], 'buitar-primary-button')}>
				指板宽度 {size}
				<input
					type="range"
					className="buitar-primary-range"
					min={2}
					max={8}
					step={1}
					defaultValue={size}
					onChange={(e) => setSize(Number(e.target.value))}
				/>
			</div>
			<RangeSlider size={size} range={[0, 16]} onChange={onChange} />
		</>
	)
}
