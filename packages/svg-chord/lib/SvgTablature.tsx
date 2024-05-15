import React, { FC, Fragment, HTMLProps, useMemo } from 'react'
import type { SvgChordPoint } from './type'

export interface SvgTablatureProps extends HTMLProps<SVGSVGElement> {
	/**
	 * 按钮数组，数组长度表示弦数
	 */
	points: SvgChordPoint[]
	/**
	 * 像素单位大小
	 */
	size?: number
	/**
	 * 颜色
	 */
	color?: string
	/**
	 * 按钮字体颜色
	 */
	fontColor?: string
	/**
	 * 指板名称
	 */
	title?: string
	/**
	 * 品位范围
	 */
	range?: [number, number]
	/**
	 * 弦数量
	 */
	strings?: number
	/**
	 * 水平展示
	 */
	horizontal?: boolean
}

export const SvgTablature: FC<SvgTablatureProps> = ({
	points,
	size = 200,
	color = '#FFF',
	fontColor = '#444',
	title,
	range,
	strings = 6,
	horizontal = false,
	...attrs
}) => {
	const lineStyle = { strokeWidth: size / 100, stroke: color }
	const [startGrade, endGrade] = useMemo(() => {
		if (range) return range
		const grades = points
			.filter((point) => point.fret > -1)
			.map((point) => point.fret)
			.sort((a, b) => a - b)
		// start 最高不超过12品
		const start = Math.min(Math.max(grades[0] - 1 || 0, 0), 12)
		// end 最低不低于start + 4品，最高不超过16品
		const end = Math.min(Math.max((grades[grades.length - 1]) || 0, start + 4), 16)
		return [start, end]
	}, [range, points])

	const gradeNums = useMemo(() => endGrade - startGrade + 1, [startGrade, endGrade])
	const gradeWidth = size * 0.84 // 品丝宽度
	const itemX = gradeWidth / (strings - 1) // 两弦之间距离
	const itemY = itemX * 1.6 // 两品之间距离
	const dotSize = itemX * 0.8 // 按钮尺寸
	const stringHeight = (gradeNums - 1) * itemY // 弦总长
	const titleHeight = size * 0.1 // 标题高度
	const padding = (size - gradeWidth) / 2 // 内边距
	const paddingY = padding + titleHeight
	const sizeY = stringHeight + titleHeight + padding + paddingY // 总高度

	/**
	 * 网格线
	 */
	const drawLines = useMemo(() => {
		const lines = []
		// 水平线条：品线
		for (let i = 0; i < gradeNums; i++) {
			let x1 = padding
			let y1 = paddingY + i * itemY
			let x2 = padding + gradeWidth
			let y2 = paddingY + i * itemY
			if (horizontal) {
				// 使用解构赋值交换 x1 和 y1 的值
				;[x1, y1] = [y1, x1]
				;[x2, y2] = [y2, x2]
			}
			const line = (
				<line
					key={`grade-${i}`}
					data-set-grade={`grade-${i}`}
					x1={x1}
					y1={y1}
					x2={x2}
					y2={y2}
					style={i === 0 ? { ...lineStyle, strokeWidth: lineStyle.strokeWidth * 3 } : lineStyle}
				/>
			)
			lines.push(line)
		}
		// 垂直线条：弦
		for (let j = 0; j < strings; j++) {
			let x1 = padding + j * itemX
			let y1 = paddingY
			let x2 = padding + j * itemX
			let y2 = paddingY + stringHeight
			if (horizontal) {
				// 使用解构赋值交换 x1 和 y1 的值
				;[x1, y1] = [y1, x1]
				;[x2, y2] = [y2, x2]
			}
			const line = (
				<line key={`string-${j}`} data-set-grade={`string-${j}`} x1={x1} y1={y1} x2={x2} y2={y2} style={lineStyle} />
			)
			lines.push(line)
		}
		return lines
	}, [size, color, horizontal, gradeNums]) // size color都需要触发重渲染

	const drawPoints = useMemo(() => {
		return points
			.filter((point) => point.fret > -1)
			.map((point, index) => {
				let pointX = padding + (point.string - 1) * itemX
				let pointY =
					point.fret === 0
						? paddingY + (point.fret - startGrade) * itemY // 0品按钮
						: paddingY + (point.fret - startGrade - 0.5) * itemY
				if (horizontal) {
					pointX = pointY
					pointY = padding + (strings - point.string) * itemX
				}
				return (
					<Fragment key={`point-${index}`}>
						<circle
							data-set-point={`point-${index}`}
							cx={pointX}
							cy={pointY}
							r={dotSize / 2}
							fill={point.color ?? color}
						/>
						<text
							x={pointX}
							y={pointY}
							textAnchor="middle"
							dominantBaseline="central"
							fontSize={dotSize * 0.8}
							fill={fontColor}
							style={{ fontWeight: 700 }}
						>
							{point.tone}
						</text>
					</Fragment>
				)
			})
	}, [points, color, fontColor, startGrade, horizontal])

	const drawTitle = useMemo(() => {
		let x = size / 2
		const y = paddingY / 2
		if (horizontal) {
			x = -x
		}
		return (
			<text
				x={x}
				y={y}
				textAnchor="middle"
				dominantBaseline="central"
				fontSize={titleHeight}
				fill={color}
				style={{ fontWeight: 700, transform: horizontal ? 'rotate(-90deg)' : 'none' }}
			>
				{title}
			</text>
		)
	}, [title, horizontal])

	const sizeObj = useMemo(
		() =>
			horizontal
				? {
						width: sizeY,
						height: size,
				  }
				: {
						width: size,
						height: sizeY,
				  },
		[sizeY, size, horizontal]
	)

	return (
		<svg {...(attrs as any)} {...sizeObj} xmlns="http://www.w3.org/2000/svg" version="1.1">
			{drawLines}
			{drawPoints}
			{drawTitle}
		</svg>
	)
}

export default SvgTablature
