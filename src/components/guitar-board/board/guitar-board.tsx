import React, { FC } from 'react'
import type { Point, ToneSchema } from 'to-guitar'
import { useBoardContext } from '../board-provider'
import { getBoardOptionsTone } from '../utils'
import { GuitarBoardOptions } from '../board-controller/controller.type'
import cx from 'classnames'
import styles from './guitar-board.module.scss'

interface GuitarBoardProps {
	range?: [number, number]
	onClickPoint?: (point: Point) => void
}

const FRET_DOT = [, , '·', , '·', , '·', , '·', , , '··', , , , '·']

export const GuitarBoard: FC<GuitarBoardProps> = ({ range = [0, 15], ...boardButtonProps }) => {
	const {
		guitarBoardOption: { keyboard },
		boardOptions: { hasTag },
	} = useBoardContext()

	if (!keyboard) {
		return null
	}

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

	const boardView = board.slice(1).map((frets, fretIndex) => {
		const fretsView = frets
			.reverse()
			.map((point, stringIndex) => <BoardButton point={point} key={stringIndex} />)

		const dotsView = (
			<div
				className={cx(
					'buitar-primary-button',
					styles['frets-dot'],
					!hasTag && styles['frets-hidden']
				)}
			>
				{FRET_DOT[fretIndex]}
				<span className={styles['frets-dot-text']}>{fretIndex + 1}</span>
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
			.map((point, stringIndex) => <BoardButton point={point} key={stringIndex} />)

		return (
			<ul className={cx(styles.frets, styles['frets-zero'])} key={fretIndex}>
				{fretsView}
			</ul>
		)
	})

	return (
		<div className={cx(styles.board)}>
			<div className={styles['board-view']}>{zeroView}</div>

			<div className={'scroll-without-bar'}>
				<div className={styles['board-view']}>{boardView}</div>
			</div>
		</div>
	)
}

const BoardButton = ({
	point,
	itemClassName,
	onClickPoint,
}: { point: Point; itemClassName?: string } & GuitarBoardProps) => {
	const { player, boardOptions, taps } = useBoardContext()
	const { hasLevel, isNote } = boardOptions

	// 被点击的point
	const tapped = taps.findIndex((tap) => tap.index === point.index) !== -1
	// 显示音调文本
	const tone = getBoardOptionsTone(point.toneSchema, boardOptions, !tapped)
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
		tapped && styles['tapped-point'], // 被点击的point
		styles['point'],
		itemClassName
	)

	const handleClick = () => {
		player.triggerPointRelease(point)
		onClickPoint?.(point)
		console.info('[point]', point)
	}

	return (
		<li onClick={handleClick} className={cls} key={point.index}>
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
