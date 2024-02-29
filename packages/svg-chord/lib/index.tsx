import React, { HTMLProps } from 'react'
import { forwardRef, useMemo } from 'react'

export type SvgChordPoint = {
	/**
	 * 品 -1代表该弦不发声
	 */
	fret: number
	string: number
	tone?: string
	color?: string
}

export interface SvgChordProps extends HTMLProps<SVGSVGElement> {
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
	 * 简洁模式
	 */
	concise?: boolean
	/**
	 * 和弦名称
	 */
	title?: string
}

const FINGER_NUMS = 5

export const SvgChord = forwardRef<SVGSVGElement, SvgChordProps>((props, ref) => {
	const { size = 300, color = 'white', points, concise, title, ...attrs } = props
	const radius = size * 0.05
	const width = size * 0.7
	const stringDistance = width / (points.length - 1) // 两根弦之间距离
	const fretDistance = width / FINGER_NUMS // 两品之间距离
	const hasTitle = !concise && title
	const titleHeight = hasTitle ? size * 0.1 : 0
	const padding = (size - width) >> 1 // 内边距
	const paddingY = padding + titleHeight
	const fontSize = size / 12
	const lineStyle = { strokeWidth: size / 100, stroke: color }
	const dotLineStyle = { strokeWidth: size / 150, stroke: color }

	// 最大品，大于5品，则需要偏移指板图
	const maxFret = points.reduce((max, point) => Math.max(max, point.fret), -Infinity)
	// 最小品（0品以上），用于判断大横按
	const minFret = points.reduce((min, point) => (point.fret > 0 ? Math.min(min, point.fret) : min), Infinity)
	// 指板图偏移位置
	const offsetFret = maxFret > FINGER_NUMS ? minFret - 1 : 0

	// 普通按钮
	const dotPoints = points.filter((point) => point.fret !== minFret)
	// 横按按钮
	const barrePoints = points.filter((point) => point.fret === minFret)

	/**
	 * 是否存在大横按
	 */
	const hasBarre = () => {
		// 横按数小于2，不存在大横按
		if (barrePoints.length < 2) return false
		let count = 0
		// 从6弦开始判断，遍历横按有效数量
		for (let stringIndex = points.length - 1; stringIndex > -1; stringIndex--) {
			const point = points[stringIndex]
			if (point.fret < minFret && count < barrePoints.length) {
				return false
			}
			if (point.fret === minFret) {
				count++
			}
		}
		return true
	}

	/**
	 * 绘制普通按钮
	 * @param point
	 * @returns
	 */
	const drawPoint = (point: SvgChordPoint) => {
		if (point.fret < 0) {
			return drawZero(point)
		} else if (point.fret - offsetFret === 0) {
			return drawZero(point, true)
		} else {
			return drawDot(point)
		}
	}

	/**
	 * 0品按钮
	 * @returns
	 */
	const drawZero = (point: SvgChordPoint, hasFret?: boolean) => {
		if (concise) return null
		const { string } = point
		const x = (string - 1) * stringDistance + padding
		const y = paddingY - width / 12
		const size = width / 24
		return hasFret ? (
			<circle key={string} cx={x} cy={y} r={width / 18} {...dotLineStyle} fill="none" />
		) : (
			<svg key={string}>
				<line x1={x - size} y1={y - size} x2={x + size} y2={y + size} {...dotLineStyle} />
				<line x1={x - size} y1={y + size} x2={x + size} y2={y - size} {...dotLineStyle} />
			</svg>
		)
	}

	/**
	 * 非0品按钮
	 */
	const drawDot = (point: SvgChordPoint) => {
		const fret = point.fret - offsetFret
		return (
			<circle
				key={point.string}
				cx={padding + (point.string - 1) * stringDistance}
				cy={paddingY + (fret - 0.5) * fretDistance}
				r={width / 12}
				fill={point.color ?? color}
			/>
		)
	}

	/**
	 * 绘制大横按
	 */
	const drawBarre = () => {
		// 不存在大横按，则普通绘制横按按钮
		if (!hasBarre()) {
			return barrePoints.map(drawPoint)
		}
		// 横按最高的弦
		const string = barrePoints.reduce((min, point) => Math.min(min, point.string), Infinity)
		const r = fretDistance * 0.3
		return (
			<rect
				x={padding + (string - 1) * stringDistance - r}
				y={paddingY + (minFret - offsetFret - 0.5) * fretDistance - r}
				width={(points.length - string) * stringDistance + 2 * r}
				height={2 * r}
				rx={r}
				ry={r}
				style={{ ...lineStyle, fill: color }}
			></rect>
		)
	}

	/**
	 * 音符显示
	 */
	const drawTone = () => {
		if (concise) return null
		const y = paddingY * 1.5 + width
		return points.map((point, index) => {
			const x = padding + (point.string - 1) * stringDistance
			return (
				<text textAnchor="middle" key={index} x={x} y={y} fill={color} style={{ fontSize }}>
					{point?.tone}
				</text>
			)
		})
	}

	/**
	 * 偏移品
	 */
	const drawOffset = () => {
		if (offsetFret === 0) return null
		return (
			<text
				x={padding * 0.4}
				y={paddingY + 0.7 * fretDistance}
				fill={color}
				textAnchor="middle"
				style={{ fontSize, fontWeight: 700 }}
			>
				{offsetFret + 1}
			</text>
		)
	}

	/**
	 * 和弦标题
	 */
	const drawTitle = () => {
		if (!hasTitle) {
			return
		}
		return (
			<text
				x="50%"
				y={padding * 0.8}
				fill={color}
				textAnchor="middle"
				style={{ fontSize: titleHeight * 1.2, fontWeight: 700 }}
			>
				{title}
			</text>
		)
	}

	/**
	 * 网格线
	 */
	const drawLines = useMemo(() => {
		const lines = []
		const itemWidth = width / FINGER_NUMS
		const itemHeight = width / (points.length - 1)
		// 水平线条：品线
		for (let i = 1; i < FINGER_NUMS; i++) {
			const line = (
				<line
					key={i}
					x1={padding}
					y1={paddingY + i * itemWidth}
					x2={padding + width}
					y2={paddingY + i * itemWidth}
					style={lineStyle}
				/>
			)
			lines.push(line)
		}
		//垂直线条：弦
		for (let j = 1; j < points.length - 1; j++) {
			const line = (
				<line
					key={FINGER_NUMS + j}
					x1={padding + j * itemHeight}
					y1={paddingY}
					x2={padding + j * itemHeight}
					y2={paddingY + width}
					style={lineStyle}
				/>
			)
			lines.push(line)
		}
		lines.push(
			<rect
				key={FINGER_NUMS + points.length}
				x={padding}
				y={paddingY}
				width={width}
				height={width}
				rx={radius}
				ry={radius}
				style={{ ...lineStyle, fill: 'none' }}
			></rect>
		)
		return lines
	}, [size, color, title]) // size color title都需要触发重渲染

	return (
		<svg {...attrs as any} ref={ref} width={size} height={size + titleHeight} xmlns="http://www.w3.org/2000/svg" version="1.1">
			{drawLines}
			{drawTone()}
			{drawBarre()}
			{drawOffset()}
			{drawTitle()}
			{dotPoints.map(drawPoint)}
		</svg>
	)
})

export default SvgChord
