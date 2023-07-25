import React, { FC, useState } from 'react'
import { ModeType, Tone, ToneSchema, transFifthsCircle } from '@buitar/to-guitar'
import { getBoardOptionsToneType } from '../guitar-board/utils'
import { useBoardContext } from '../index'
import classnames from 'classnames'

import styles from './fifths-circle.module.scss'

const angle = [
	-Math.PI / 2,
	-Math.PI / 3,
	-Math.PI / 6,

	0,
	Math.PI / 6,
	Math.PI / 3,
	Math.PI / 2,
	(Math.PI * 2) / 3,
	(Math.PI * 5) / 6,
	Math.PI,

	(-Math.PI * 5) / 6,
	(-Math.PI * 2) / 3,
]

const OUTER_TONES = transFifthsCircle('C')
const INNER_TONES = transFifthsCircle('A')

export const FifthsCircle: FC<{
	/**
	 * svg尺寸，不能超过父容器大小
	 */
	size?: number
	/**
	 * 圆环厚度
	 */
	thin?: number
	/**
	 * 是否展示小调五度圈
	 */
	minor?: boolean
	defaultIndex?: number
	onClick?: ({ tone, mode }: { tone: ToneSchema; mode: ModeType }) => void
	[x: string]: any
}> = ({ size = 400, thin = 60, minor = true, defaultIndex = -1, onClick, ...props }) => {
	const { boardOptions } = useBoardContext()
	const [checked, setChecked] = useState<number>(defaultIndex)
	const toneType = getBoardOptionsToneType(boardOptions)
	const cx = size >> 1
	const cy = size >> 1
	const cr = size >> 1
	const outerCircle = OUTER_TONES.map((tone) => tone[toneType])
	const innerCircle = INNER_TONES.map((tone) => `${tone[toneType]}m`)
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={size}
			height={size}
			viewBox={`0 0 ${size} ${size}`}
			{...props}
		>
			<Arc
				cx={cx}
				cy={cy}
				cr={cr}
				thin={thin}
				className={styles.arc}
				checked={checked}
				offset={0}
				onClick={(index: number) => {
					setChecked(index)
					onClick?.({ tone: OUTER_TONES[index], mode: 'major' })
				}}
			></Arc>
			<Text
				cx={cx}
				cy={cy}
				cr={cr - thin / 2}
				list={outerCircle}
				fill="#eeea"
				style={{ fontSize: size / 12 }}
			/>

			{minor && (
				<>
					<Arc
						cx={cx}
						cy={cy}
						cr={cr - thin - 2}
						thin={thin}
						className={styles.arc}
						checked={checked}
						offset={12}
						onClick={(index: number) => {
							setChecked(index + 12)
							onClick?.({ tone: INNER_TONES[index], mode: 'minor' })
						}}
					></Arc>
					<Text
						cx={cx}
						cy={cy}
						cr={cr - (thin * 3) / 2}
						list={innerCircle}
						fill="#eee9"
						style={{ fontSize: size / 18 }}
					/>
				</>
			)}
		</svg>
	)
}

const Text: FC<any> = ({
	cx = 100,
	cy = 100,
	cr = 80,
	list = [],
	fontSize = 30,
	style,
	...props
}) => {
	return (
		<>
			{(list as string[]).map((item, index) => {
				const x = cr * Math.cos(angle[index]) + cx
				const y = cr * Math.sin(angle[index]) + cy + fontSize / 3
				return (
					<text
						{...props}
						pointerEvents="none"
						textAnchor="middle"
						key={index}
						x={x}
						y={y}
						style={{ fontSize, ...style }}
					>
						{item}
					</text>
				)
			})}
		</>
	)
}

const Arc: FC<any> = ({
	cx = 100,
	cy = 100,
	cr = 100,
	thin = 40,
	checked = -1, // 选中的index
	offset = 0, // 大小调圆环的index便宜，父元素:[0,11]是大调圆环下标，[12,23]是小调圆环下标
	...props
}) => {
	const r = cr - thin / 2
	const x = cx
	const y = cy - r
	const transR = r - (Math.PI * 2 * r) / 360 // 减少实际圆弧半径，外弧长多余1度的间隙空间
	/**
	 * 0.485和0.125分别是在约30度弧线下sin和cos
	 * 实际上是29度，因为弧线段需要有间隙
	 */
	const d = `M${x} ${y} A ${transR} ${transR} 0 0 1 ${x + 0.485 * r} ${y + 0.125 * r}`
	return (
		<>
			{new Array(12).fill(1).map((_i, index) => {
				return (
					<path
						{...props}
						key={index}
						className={classnames(
							props.className,
							checked - offset === index && styles['arc-checked']
						)}
						onClick={() => props.onClick(index)}
						d={d}
						strokeWidth={thin}
						fill="transparent"
						transform={`rotate(${index * 30 - 15}, ${cx}, ${cy})`}
					/>
				)
			})}
		</>
	)
}
