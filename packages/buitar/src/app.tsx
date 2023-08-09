import { BrowserRouter, Routes, Route, useRoutes, Outlet } from 'react-router-dom'
import { MenuProvider, SlideMenu, AudioBtn } from '@/components'
import { RouteType, routeConfig, routeList } from '@/pages/router'
import cx from 'classnames'
import styles from './style.module.scss'
import { Fragment, memo } from 'react'

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

const Board = memo(() => {
	let element = useRoutes(routeConfig)
	return (
		<div id="board" className={cx(styles.board)}>
			{element}
		</div>
	)
})
