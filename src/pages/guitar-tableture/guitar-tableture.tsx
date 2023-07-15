import React, { FC, useEffect, useState } from 'react'
import { BoardProvider, GuitarBoard, useBoardContext } from '@/components/guitar-board'
import { TabSwitch, usePagesIntro } from '@/components'
import { Note, Point, getModeFregTaps } from '@to-guitar'
import { ToneModeController } from '@/components/guitar-board/board-controller/tone-mode-controller/tone-mode-controller.component'

export const GuitarTableture: FC = () => {
	const intro = usePagesIntro()

	return (
		<BoardProvider>
			{intro}
			<TapedGuitarBoard />
		</BoardProvider>
	)
}

const TapedGuitarBoard = () => {
	const { setTaps, setHighFixedTaps, guitarBoardOption } = useBoardContext()
	const [isUp, setIsUp] = useState(false) // 是否上行音阶指型
	const [rootPoint, setRootPoint] = useState<Point>() // 根音

	const handleCheckedPoint = (points: Point[]) => {
		if (!points) {
			return
		}
		setRootPoint(points[0])
	}

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
