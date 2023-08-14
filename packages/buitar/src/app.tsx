import { BrowserRouter, useRoutes } from 'react-router-dom'
import { MenuProvider, SlideMenu, AudioBtn, BoardProvider } from '@/components'
import { routeConfig } from '@/pages/router'
import { Suspense } from 'react'
import cx from 'classnames'
import styles from './style.module.scss'

export const App = () => {
	return (
		<div className={styles.app}>
			<BrowserRouter>
				<MenuProvider>
					<SlideMenu />
					<Board />
					<AudioBtn />
				</MenuProvider>
			</BrowserRouter>
		</div>
	)
}

// const useRoutes = (routes: RouteType[]): JSX.Element[] =>
// 	routes.map((route, index) => (
// 		<Fragment key={`${route.path}-${index}`}>
// 			<Route path={route.path} element={<route.Component route={route} />} />
// 			{route.children && (
// 				<Route path={`${route.path}*`} element={<Routes>{useRoutes(route.children)}</Routes>} />
// 			)}
// 		</Fragment>
// 	))

// const Board = memo(() => {
// 	const routes = useRoutes(routeConfig)
// 	return (
// 		<div id="board" className={cx(styles.board)}>
// 			<Routes>{routes}</Routes>
// 		</div>
// 	)
// })

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
