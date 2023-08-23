import { BrowserRouter, useRoutes } from 'react-router-dom'
import { ConfigProvider, SlideMenu, AudioBtn, BoardProvider } from '@/components'
import { routeConfig } from '@/pages/router'
import { Suspense } from 'react'
import cx from 'classnames'
import styles from './style.module.scss'
import { DrumProvider } from './components/drum-board/drum-provider'

export const App = () => {
	return (
		<BrowserRouter>
			<ConfigProvider>
				<div className={styles.app}>
					<SlideMenu />
					<Board />
					<AudioBtn />
				</div>
			</ConfigProvider>
		</BrowserRouter>
	)
}

const Board = () => {
	const element = useRoutes(routeConfig)
	return (
		<BoardProvider>
			<DrumProvider>
				<div id="board" className={cx(styles.board)}>
					<Suspense fallback={<div>Loading...</div>}>{element}</Suspense>
				</div>
			</DrumProvider>
		</BoardProvider>
	)
}
