import React, { FC, useEffect, useMemo, useRef } from 'react'
import type { Point, ToneSchema } from '@buitar/to-guitar'
import { useBoardContext } from '../board-provider'
import { getBoardOptionsTone } from '../utils'
import { GuitarBoardOptions } from '../board-controller/controller.type'
import { useBoardTouch, useBoardWheel, useGuitarKeyDown } from '@/utils/hooks/use-board-event'
import { useDebounce } from '@/utils/hooks/use-debouce'
import cx from 'classnames'
import styles from './guitar-board.module.scss'

interface GuitarBoardProps {
	/**
	 * 渲染吉他品数范围
	 */
	range?: [number, number]
	/**
	 * 选中指位 callback
	 * @param points
	 * @returns
	 */
	onCheckedPoints?: (points: Point[]) => void
	/**
	 * 键盘切换监听范围
	 * @param part
	 * @returns
	 */
	onChangePart?: (part: boolean) => void
}

const FRET_DOT = [, , '·', , '·', , '·', , '·', , , '··', , , , '·']

export const GuitarBoard: FC<GuitarBoardProps> = ({
	range = [1, 16],
	onCheckedPoints,
	onChangePart,
}) => {
	const {
		guitarBoardOption: { keyboard },
		boardOptions: { hasTag },
		emphasis,
		setEmphasis,
		player,
		resumePlayer,
	} = useBoardContext()
	const boardRange = range[0] < 1 ? [1, range[1]] : range;
	const scrollRef = useRef<HTMLDivElement>(null)
	
	// 鼠标事件监听
	const { handler } = useBoardTouch(emphasis, setEmphasis, {
		onClick: resumePlayer,
	})
	// 键盘事件监听
	const { part, keyHandler } = useGuitarKeyDown(emphasis, setEmphasis)
	// 滚轮事件监听
	// useBoardWheel(scrollRef.current) // 水平滚动与触摸板逻辑冲突

	const boardList = useMemo(() => {
		if (!keyboard) {
			return null
		}
		return exchangeBoardList(keyboard)
	}, [keyboard])

	// 指位停留 30 ms以上 => play & checked
	const debouceEmphasis = useDebounce(emphasis, 30)
	useEffect(() => {
		if (debouceEmphasis.length <= 0 || !boardList) {
			return
		}
		const points = debouceEmphasis.map((index) => boardList[Number(index)])

		console.log(
			'%c Points ',
			'color:white; background:rgb(57, 167, 150);border-radius: 2px',
			points
		)
		player.triggerPointRelease(points)
		onCheckedPoints?.(points)
	}, [debouceEmphasis])

	useEffect(() => {
		onChangePart?.(part)
	}, [part])

	if (!keyboard) {
		return null
	}

	const board = exchangeBoardArray(keyboard)

	const boardView = board.slice(boardRange[0], boardRange[1] + 1).map((frets, fretIndex) => {
		const fretsView = frets
			.reverse()
			.map((point, stringIndex) => <BoardButton key={stringIndex} point={point} />)

		const dotsView = (
			<div
				className={cx(
					'buitar-primary-button',
					styles['frets-dot'],
					!hasTag && styles['frets-hidden']
				)}
			>
				{FRET_DOT[fretIndex + boardRange[0] - 1]}
				<span className={styles['frets-dot-text']}>{fretIndex  + boardRange[0]}</span>
			</div>
		)
		return (
			<ul className={cx(styles.frets)} key={fretIndex}>
				{fretsView}
				{dotsView}
			</ul>
		)
	})

	const zeroView = board.slice(0, 1).map((frets, fretIndex) => {
		const fretsView = frets
			.reverse()
			.map((point, stringIndex) => <BoardButton key={stringIndex} point={point} />)

		return (
			<ul className={cx(styles.frets, styles['frets-zero'])} key={fretIndex}>
				{fretsView}
			</ul>
		)
	})

	return (
		<div id="fret-board" className={cx(styles.board)} {...handler} {...keyHandler}>
			<div className={styles['board-view']}>{zeroView}</div>
			<div ref={scrollRef} className={'scroll-without-bar'}>
				<div className={styles['board-view']}>{boardView}</div>
			</div>
		</div>
	)
}

const BoardButton = ({
	point,
	itemClassName,
}: { point: Point; itemClassName?: string } & GuitarBoardProps) => {
	const { boardOptions, taps, fixedTaps, highFixedTaps, emphasis } = useBoardContext()
	const { hasLevel, isNote } = boardOptions

	// key
	const key = `${point.index}`
	// 交互反馈强调的point
	const emphasised = emphasis.includes(key)
	// 固定的point
	const fixed = !!fixedTaps.find((tap) => tap.index === point.index)
	// 固定最高亮的point
	const highFixed = !!highFixedTaps.find((tap) => tap.index === point.index)
	// 被点击的point
	const tapped = !!taps.find((tap) => tap.index === point.index)
	// 显示音调文本(非固定&非强调&非选择的指位才忽视半音显示)
	const tone = getBoardOptionsTone(point.toneSchema, boardOptions, !tapped && !fixed && !emphasised)
	// 显示八度音高
	const level = tone && getLevel(point.toneSchema, boardOptions)

	const cls = cx(
		'buitar-primary-button',
		!tone && styles['empty-point'], // 隐藏半音
		!isNote && hasLevel && point.toneSchema.level //处理数字显示时八度音高
			? point.toneSchema.level > 3
				? styles['interval-point-reverse']
				: styles['interval-point']
			: null,
		emphasised && styles['emphasised-point'], // 被强调的point
		fixed && styles['fixed-point'], // 被固定高亮的point
		tapped && styles['tapped-point'], // 被点击的point
		highFixed && styles['high-fixed-point'], // 被点击的point
		styles['point'],
		itemClassName
	)

	return (
		<li className={cls} key={key} data-key={key}>
			{tone}
			{level}
		</li>
	)
}

/**
 * 数字显示下的八度音高UI
 * @param toneSchema
 * @param boardOptions
 */
const getLevel = (toneSchema: ToneSchema, boardOptions: GuitarBoardOptions) => {
	if (!boardOptions.hasLevel || !toneSchema.level) {
		return null
	}
	const { level } = toneSchema
	if (boardOptions.isNote) {
		return <span className={styles.level}>{level}</span>
	}
	return (
		<span className={styles['level-dot']}>{new Array(Math.abs(level - 3)).fill('·').join('')}</span>
	)
}

/**
 * 二维数组纵横交换
 * @returns
 */
const exchangeBoardArray = (keyboard: Point[][]) => {
	const board: Point[][] = []
	keyboard.forEach((string, stringIndex) => {
		string.forEach((point, fretIndex) => {
			if (board[fretIndex]) {
				board[fretIndex][stringIndex] = point
			} else {
				board[fretIndex] = [point]
			}
		})
	})
	return board
}

const exchangeBoardList = (keyboard: Point[][]) => {
	const list: Point[] = []
	keyboard.forEach((string) => {
		list.push(...string)
	})
	return list
}
