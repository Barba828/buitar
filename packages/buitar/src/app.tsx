import { BrowserRouter, useRoutes } from 'react-router-dom'
import { ConfigProvider, SlideMenu, FixedBtns, BoardProvider, PageHeader } from '@/components'
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
					<BoardProvider>
						<DrumProvider>
							<SlideMenu />
							<Board />
							<FixedBtns />
						</DrumProvider>
					</BoardProvider>
				</HelmetProvider>
			</ConfigProvider>
		</BrowserRouter>
	)
}

const Board = () => {
	const element = useRoutes(routeConfig)
	return (
		<main id="board">
			<PageHeader />
			<Suspense fallback={<div>Loading...</div>}>{element}</Suspense>
		</main>
	)
}
