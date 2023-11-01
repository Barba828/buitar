import { BrowserRouter, useRoutes } from 'react-router-dom'
import { ConfigProvider, SlideMenu, AudioBtn, BoardProvider } from '@/components'
import { routeConfig } from '@/pages/router'
import { Suspense } from 'react'
import { DrumProvider } from './components/drum-board/drum-provider'
import './app.scss'

export const App = () => {
	return (
		<BrowserRouter>
			<ConfigProvider>
				<SlideMenu />
				<Board />
				<AudioBtn />
			</ConfigProvider>
		</BrowserRouter>
	)
}

const Board = () => {
	const element = useRoutes(routeConfig)
	return (
		<BoardProvider>
			<DrumProvider>
				<div id="board">
					<Suspense fallback={<div>Loading...</div>}>{element}</Suspense>
				</div>
			</DrumProvider>
		</BoardProvider>
	)
}
