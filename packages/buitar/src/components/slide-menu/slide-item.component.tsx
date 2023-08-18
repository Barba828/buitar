import { useCallback, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Icon } from '@/components/icon'
import { useMenuContext } from './index'
import { routeConfig } from '@/pages/router'
import { menuConfig } from './config-provider/menu-config'
import { Switch } from '../index'
import { clearStore } from '@/utils/hooks/use-store'
import { useRouteFind, useRouteMatch } from '@/utils/hooks/use-routers'

import cx from 'classnames'
import styles from './slide-item.module.scss'

export const SlideMenu = () => {
	const { menus, dispatchMenus } = useMenuContext()
	const { pathname } = useLocation()
	const navigate = useNavigate()
	const [extend, setExtend] = useState<boolean>(false)
	const curRoute = useRouteMatch()
	const homeRoute = useRouteFind('Home')
	const showBack = useMemo(() => !!curRoute?.meta?.back, [curRoute])

	const toggleExtend = useCallback(() => {
		setExtend(!extend)
	}, [extend])

	const header = (
		<Link
			to={homeRoute.path}
			className={cx(styles['slide-menu-tab-title'])}
			onClick={() => {
				setExtend(false)
			}}
		>
			Buitar
		</Link>
	)

	const links = routeConfig
		.filter((route) => route.type === 'menu')
		.map((route) => (
			<Link
				to={route.path}
				key={route.path}
				className={cx(
					styles['slide-menu-tab-item'],
					pathname === route.path && styles['slide-menu-tab-item-checked']
				)}
				onClick={() => {
					setExtend(false)
				}}
			>
				{route.name}
			</Link>
		))

	// 侧边栏设置项
	const options = menuConfig.map((item, index) => {
		const checked = !!menus[item.key]
		return (
			<div className={cx(styles['slide-menu-tab-item'])} key={`${index}`}>
				{item.name}
				<Switch
					defaultValue={checked}
					onChange={(value) => {
						dispatchMenus({ type: 'set', payload: { [item.key]: value } })
					}}
				/>
			</div>
		)
	})
	options.push(
		<div key="clear" className={cx(styles['slide-menu-tab-item'])} onClick={clearStore}>
			清理
			<span className={cx(styles['slide-menu-tab-hint'])}>有效解决应用崩溃</span>
		</div>
	)
	options.unshift(<div key="seperate" className={styles['seperate']}></div>)

	const footer = (
		<div className={styles['slide-menu-tab-footer']}>
			<a
				href="https://github.com/Barba828/buitar"
				className={cx(styles['slide-menu-tab-item'], styles['slide-menu-tab-item-checked'])}
				target="view_window"
			>
				Github
				<Icon size={20} name="icon-github" />
			</a>
		</div>
	)

	return (
		<div
			id="slide-menu"
			className={cx(styles['slide-menu'], extend && styles['slide-menu__extend'])}
		>
			{showBack ? (
				<div
					className={styles['slide-menu-bar']}
					onClick={() => {
						navigate(-1)
					}}
				>
					<Icon name="icon-back" size={26} className={styles['slide-menu-bar-icon']} />
				</div>
			) : (
				<div className={styles['slide-menu-bar']} onClick={toggleExtend}>
					<Icon name="icon-option" size={26} className={styles['slide-menu-bar-icon']} />
				</div>
			)}
			<nav className={cx(styles['slide-menu-tab'], 'scroll-without-bar')}>
				{header}
				{links}
				{options}
				{footer}
			</nav>
			<div
				onClick={toggleExtend}
				onTouchStart={toggleExtend}
				className={styles['slide-menu-intro']}
			></div>
		</div>
	)
}
