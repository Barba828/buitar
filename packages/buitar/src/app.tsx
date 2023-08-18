import { BrowserRouter, useRoutes } from 'react-router-dom'
import { MenuProvider, SlideMenu, AudioBtn, BoardProvider } from '@/components'
import { routeConfig } from '@/pages/router'
import { Suspense } from 'react'
import cx from 'classnames'
import styles from './style.module.scss'

export const App = () => {
	return (
		<BrowserRouter>
			<MenuProvider>
				<div className={styles.app}>
					<SlideMenu />
					<Board />
					<AudioBtn />
				</div>
			</MenuProvider>
		</BrowserRouter>
	)
}

const Board = () => {
	const element = useRoutes(routeConfig)
	return (
		<BoardProvider>
			<div id="board" className={cx(styles.board)}>
				<Suspense fallback={<div>Loading...</div>}>{element}</Suspense>
			</div>
		</BoardProvider>
	)
}
