import React from 'react'
import { transBoard } from 'to-guitar'

import cx from 'classnames'
import styles from './style.module.scss'
import { slideMenu } from '@/components/slide-menu'
import { TonePlayer, tonePlayer } from './utils'
import { boardController } from './components/board-controller'
// import { slideMenu } from 'Templates/slide-menu'

export const App = () => {
	const player = new TonePlayer()
	const board = transBoard()
	const boardView = board.reverse().map((strings, stringIndex) => {
		const stringsView = strings.map((point) => {
			const empty = point.toneSchema.note.length > 1
			const tone = empty ? '' : point.toneSchema.note
			return (
				<li
					onClick={() => {
						console.log(point)

						// tonePlayer()
						// TonePlayer.triggerAttacks()
						// player.triggerAttackRelease(['D4', 'F4', 'A4', 'C4', 'E4'])
						// player.triggerAttack(['D4', 'F4', 'A4', 'C4', 'E4'], 0.005)
					}}
					className={cx(styles.point, empty && styles['empty-point'])}
					key={point.index}
				>
					{tone}
				</li>
			)
		})

		return (
			<ul className={styles.strings} key={stringIndex}>
				{stringsView}
			</ul>
		)
	})
	return (
		<div className={styles.app}>
			<div className={styles.board}>{boardView}</div>
			{slideMenu()}
			{boardController()}
			<button
				onClick={() => {
					player.setInstrument('guitar-nylon')
				}}
			>
				wqeqw
			</button>
		</div>
	)
}
