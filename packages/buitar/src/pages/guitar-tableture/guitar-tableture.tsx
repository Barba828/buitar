import { FC, useEffect, useMemo } from 'react'
import { useBoardContext } from '@/components/guitar-board'
import { TabSwitch, usePagesIntro } from '@/components'
import { Link, Outlet } from 'react-router-dom'
import { useRouteFind, useRouteMatch } from '@/utils/hooks/use-routers'
import cx from 'classnames'
import styles from './guitar-tableture.module.scss'

export const GuitarTableture: FC = () => {
	const intro = usePagesIntro()
	const { clearTaps } = useBoardContext()
	const { children = [] } = useRouteFind('GuitarTableture')
	const { path } = useRouteMatch()
	const tabList = useMemo(() => children.filter((route) => route.name), [children])
	const defaultTab = useMemo(
		() => tabList.find((route) => route.path === path) || tabList[0],
		[tabList]
	)

	useEffect(() => () => clearTaps(), [])

	return (
		<>
			{intro}
			<TabSwitch
				className={cx(styles['tableture-tab'])}
				values={tabList}
				defaultValue={defaultTab}
				renderItem={(route) => (
					<Link to={route.path} className="flex-center">
						{route.name}
					</Link>
				)}
			/>
			<Outlet />
		</>
	)
}
