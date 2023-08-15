import { FC } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { ControllerList } from '@/components/controller'
import { useRouteFind, useRouteMatch } from '@/utils/hooks/use-routers'
import { usePagesIntro } from '@/components'

import styles from './play-tools.module.scss'

export const PlayToolsHome: FC = () => {
	const intro = usePagesIntro()
	const toolsRoute = useRouteFind('PlayTools') // 工具菜单页路由
	const curRoute = useRouteMatch() // 当前页面一级路由

	const isToolsHome = toolsRoute === curRoute // 当前在菜单主页

	return isToolsHome ? (
		<>
			{intro}
			<ControllerList
				size="large"
				list={toolsRoute.children || []}
				renderListItem={(route) => (
					<Link to={route.path} className={styles['route-item']}>
						{route.name}
					</Link>
				)}
				checkedItem={() => true}
			/>
		</>
	) : (
		<Outlet></Outlet>
	)
}
