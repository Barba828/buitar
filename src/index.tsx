import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MenuProvider, SlideMenu } from '@/components'
import { routeConfig } from '@/pages/router'
import cx from 'classnames'
import styles from './style.module.scss'

export const App = () => {
	return (
		<div className={styles.app}>
			<BrowserRouter>
				<MenuProvider>
					<SlideMenu />
					<Board />
				</MenuProvider>
			</BrowserRouter>
		</div>
	)
}

const Board = () => {
	const routes = routeConfig.map((route) => (
		<Route key={route.path} path={route.path} element={<route.Component />} />
	))
	return (
		<div className={cx(styles.board)}>
			<Routes>{routes}</Routes>
		</div>
	)
}
