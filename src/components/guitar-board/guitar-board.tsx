import React, { useEffect } from 'react'
import { ToneSchema, transBoard } from 'to-guitar'
import { TonePlayer } from '@/utils'
import cx from 'classnames'
import styles from './guitar-board.module.scss'
import { useBoardContext } from './board-provider'
import { getBoardOptionsTone } from './utils'
import { GuitarBoardOptions } from './controller.type'

const player = new TonePlayer()

export const GuitarBoard = () => {
	const { instrument, boardOptions } = useBoardContext()
	const { hasLevel, isNote } = boardOptions

	useEffect(() => {
		player.setInstrument(instrument)
	}, [instrument])

	const board = transBoard()
	const boardView = board.reverse().map((strings, stringIndex) => {
		const stringsView = strings.map((point) => {
			const tone = getBoardOptionsTone(point.toneSchema, boardOptions)
			const level = tone && getLevel(point.toneSchema, boardOptions)

			const cls = cx(
				'buitar-primary-button',
				styles.point,
				!tone && styles['empty-point'],
				!isNote && hasLevel && point.toneSchema.level
					? point.toneSchema.level > 3
						? styles['interval-point-reverse']
						: styles['interval-point']
					: null
			)

			return (
				<li
					onClick={() => {
						const tone = `${point.toneSchema.note}${point.toneSchema.level}`
						player.triggerAttackRelease(tone)
					}}
					className={cls}
					key={point.index}
				>
					{tone}
					{level}
				</li>
			)
		})

		return (
			<ul className={styles.strings} key={stringIndex}>
				{stringsView}
			</ul>
		)
	})
	return <div className={cx(styles.board, 'scroll-without-bar')}>{boardView}</div>
}

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
