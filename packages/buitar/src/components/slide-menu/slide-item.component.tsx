import { useCallback, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Icon } from '@/components/icon'
import { useConfigContext } from './index'
import { routeConfig } from '@/pages/router'
import { menuConfig } from './config-provider/menu-config'
import { Switch } from '../index'
import { clearStore } from '@/utils/hooks/use-store'
import { useRouteFind, useRouteMatch } from '@/utils/hooks/use-routers'
import { useIsMobile } from '@/utils/hooks/use-device'

import cx from 'classnames'
import styles from './slide-item.module.scss'

export const SlideMenu = () => {
	const { menus, dispatchMenus } = useConfigContext()
	const { pathname } = useLocation()
	const navigate = useNavigate()
	const [extend, setExtend] = useState<boolean>(false)
	const curRoute = useRouteMatch()
	const homeRoute = useRouteFind('Home')
	const showBack = useMemo(() => !!curRoute?.meta?.back, [curRoute])
	const isMobile = useIsMobile()

	const toggleExtend = useCallback(() => {
		setExtend(!extend)
	}, [extend])

	const header = (
		<Link to={homeRoute.path} className={cx(styles['slide-menu-nav-title'])} onClick={toggleExtend}>
			Buitar
		</Link>
	)

	const links = routeConfig
		.filter((route) => route.meta?.menu)
		.map((route) => (
			<Link
				to={route.path}
				key={route.path}
				className={cx(
					styles['slide-menu-nav-item'],
					pathname === route.path && styles['slide-menu-nav-item-checked']
				)}
			>
				{route.meta?.icon && <Icon name={route.meta?.icon} />}
				{extend && <div className={styles['slide-menu-nav-item-name']}>{route.name}</div>}
			</Link>
		))

	const tabLinks = [
		...routeConfig.filter((route) => route.meta?.tabMenu),
		...routeConfig.filter((route) => route.meta?.menu && !route.meta.tabMenu),
	].map((route) => (
		<Link
			to={route.path}
			key={route.path}
			className={cx(
				styles['slide-menu-nav-item'],
				pathname === route.path && styles['slide-menu-nav-item-checked']
			)}
			onClick={() => setExtend(false)}
		>
			{route.meta?.icon && <Icon name={route.meta?.icon} />}
			<div className={styles['slide-menu-nav-item-name']}>{route.name}</div>
		</Link>
	))

	// 侧边栏设置项
	// const options = menuConfig.map((item, index) => {
	// 	const checked = !!menus[item.key]
	// 	return (
	// 		<div className={cx(styles['slide-menu-nav-item'])} key={`${index}`}>
	// 			{item.name}
	// 			<Switch
	// 				defaultValue={checked}
	// 				onChange={(value) => {
	// 					dispatchMenus({ type: 'set', payload: { [item.key]: value } })
	// 				}}
	// 			/>
	// 		</div>
	// 	)
	// })
	// options.push(
	// 	<div key="clear" className={cx(styles['slide-menu-nav-item'])} onClick={clearStore}>
	// 		重置
	// 		<span className={cx(styles['slide-menu-nav-hint'])}>清理缓存</span>
	// 	</div>
	// )
	// options.unshift(<div key="seperate" className={styles['seperate']}></div>)

	const footer = (
		<div className={styles['slide-menu-nav-footer']}>
			<a
				href="https://github.com/Barba828/buitar"
				className={cx(styles['slide-menu-nav-item'])}
				target="view_window"
			>
				<Icon size={20} name="icon-github" />
				<div className={styles['slide-menu-nav-item-name']}>Github</div>
			</a>
		</div>
	)

	return (
		<header
			id="slide-menu"
			className={cx(styles['slide-menu'], extend && styles['slide-menu__extend'])}
		>
			{/* {showBack ? (
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
			)} */}
			<div className={styles['slide-menu-tab-trigger']} onClick={toggleExtend}>
				<Icon
					name="icon-back"
					size={10}
					className={styles['slide-menu-tab-trigger-icon']}
					style={extend ? { rotate: '-90deg' } : { rotate: '90deg' }}
				></Icon>
			</div>
			<nav className={cx(styles['slide-menu-nav'])}>
				<div className={styles['slide-menu-trigger']} onClick={toggleExtend}>
					<Icon name="icon-option" size={26} className={styles['slide-menu-trigger-icon']} />
				</div>
				{header}
				{isMobile ? tabLinks : links}
				{/* {options} */}
				{footer}
			</nav>
		</header>
	)
}
