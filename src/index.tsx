import React from 'react'
import { BoardController, GuitarBoard, SlideMenu } from '@/components'
import { BoardProvider } from '@/components/guitar-board/board-provider'
import styles from './style.module.scss'

export const App = () => {
	return (
		<div className={styles.app}>
			<BoardProvider>
				<GuitarBoard />
				<BoardController />
				<SlideMenu />
			</BoardProvider>
		</div>
	)
}
