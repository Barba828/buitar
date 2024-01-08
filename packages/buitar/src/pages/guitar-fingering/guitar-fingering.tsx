import { FC, useEffect, useMemo } from 'react'
import { useBoardContext } from '@/components/guitar-board'
import { TabSwitch, PagesIntro, PagesMeta } from '@/components'
import { Link, Outlet } from 'react-router-dom'
import { useRouteFind, useRouteMatch } from '@/utils/hooks/use-routers'
import cx from 'classnames'
import styles from './guitar-fingering.module.scss'

export const GuitarFingering: FC = () => {
	const { clearTaps } = useBoardContext()
	const { children = [] } = useRouteFind('GuitarFingering')
	const { path } = useRouteMatch()
	const tabList = useMemo(() => children.filter((route) => route.name), [children])
	const defaultTab = useMemo(
		() => tabList.find((route) => route.path === path) || tabList[0],
		[tabList]
	)

	useEffect(() => () => clearTaps(), [])

	return (
		<>
			<PagesMeta/>
			<PagesIntro/>
			<TabSwitch
				className={cx(styles['fingering-tab'])}
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
