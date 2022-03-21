import React from 'react'
import { BoardContainer, MenuProvider, SlideMenu } from '@/components'
import styles from './style.module.scss'
import cx from 'classnames'
import { FifthsCircle } from './components/fifths-circle'

export const App = () => {
	return (
		<div className={styles.app}>
			<MenuProvider>
				<SlideMenu />
				<div className={cx(styles.board)}>
					<BoardContainer />
				</div>
			</MenuProvider>
		</div>
	)
}
