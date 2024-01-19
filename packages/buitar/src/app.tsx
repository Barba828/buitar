import { BrowserRouter, useRoutes } from 'react-router-dom'
import { ConfigProvider, SlideMenu, AudioBtn, BoardProvider, PageHeader } from '@/components'
import { routeConfig } from '@/pages/router'
import { Suspense } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { DrumProvider } from './components/drum-board/drum-provider'
import './app.scss'

export const App = () => {
	return (
		<BrowserRouter>
			<ConfigProvider>
				<HelmetProvider>
					<SlideMenu />
					<Board />
					<AudioBtn />
				</HelmetProvider>
			</ConfigProvider>
		</BrowserRouter>
	)
}

const Board = () => {
	const element = useRoutes(routeConfig)
	return (
		<BoardProvider>
			<DrumProvider>
				<main id="board">
					<PageHeader/>
					<Suspense fallback={<div>Loading...</div>}>{element}</Suspense>
				</main>
			</DrumProvider>
		</BoardProvider>
	)
}
