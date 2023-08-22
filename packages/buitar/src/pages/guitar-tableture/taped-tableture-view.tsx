import { useState, useEffect } from "react"
import { useConfigContext, useBoardContext, TabSwitch, Icon, BoardOptionsController, ToneModeController, GuitarBoard } from "@/components"
import { Point, ModeType, getModeRangeTaps, getModeFregTaps } from "@buitar/to-guitar"
import cx from 'classnames'

import styles from './guitar-tableture.module.scss'
/**
 * 点击获取该位置的任一指型
 * @returns
 */
export const TapedGuitarBoardTableture = () => {
	const tabList = [
		{
			key: 'all',
			label: '全指板',
		},
		{
			key: 'up',
			label: '上行',
		},
		{
			key: 'down',
			label: '下行',
		},
	]
	const { menus } = useConfigContext()
	const { setTaps, setHighFixedTaps, guitarBoardOption, guitar } = useBoardContext()
	const [tab, setTab] = useState(tabList[0]) // 是否上行音阶指型
	const [rootPoint, setRootPoint] = useState<Point>() // 根音
	const [locked, setLocked] = useState(false) // 锁定指板

	const handleCheckedPoint = (points: Point[]) => {
		if (!points) {
			return
		}
		setRootPoint(points[0])
	}

	const handleCheckedMode = (item: ModeType) => {
		guitar.setOptions({ mode: item })
	}

	// 监听变化，更改指型
	useEffect(() => {
		if (!rootPoint) {
			return
		}
		if (locked) {
			return
		}
		let taps = []
		if (tab.key === 'all') {
			// 获取range全指板的指型
			taps = getModeRangeTaps(rootPoint, {
				board: guitarBoardOption.keyboard,
				mode: guitarBoardOption.mode,
				range: [0, guitar.board.baseFret - 1],
				ignorePitch: false,
			})
		} else {
			// 获取改品位的上下行指型
			const fregTaps = getModeFregTaps(
				rootPoint,
				guitarBoardOption.keyboard,
				guitarBoardOption.mode
			)
			taps = tab.key === 'up' ? fregTaps.up : fregTaps.down
		}
		const highFixedTaps = taps.filter((tap) => tap.tone === rootPoint.tone)
		// 设置指位
		setTaps(taps)
		// 设置根音高亮
		setHighFixedTaps(highFixedTaps)
	}, [rootPoint, tab, guitarBoardOption.mode])

	return (
		<>
			<ToneModeController mode={guitar.board.mode} onClick={handleCheckedMode} />
			<div className={cx(styles['tableture-tab-wrap'])}>
				<TabSwitch
					values={tabList}
					defaultValue={tabList[0]}
					onChange={(tab) => setTab(tab)}
					renderItem={(tab) => tab.label}
					className={cx(styles['tableture-tab'])}
				/>
				<div
					className={cx(
						'primary-button',
						styles['tableture-lock'],
						locked && styles['tableture-locked']
					)}
					onClick={() => setLocked(!locked)}
				>
					<Icon name="icon-suoding" />
				</div>
			</div>
			<GuitarBoard onCheckedPoints={handleCheckedPoint} />
			{menus.board_setting && <BoardOptionsController extendItem={false}/>}
		</>
	)
}
