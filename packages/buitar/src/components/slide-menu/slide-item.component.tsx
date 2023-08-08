import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Icon } from '@/components/icon'
import { useMenuContext } from './index'
import { routeConfig, routeMap } from '@/pages/router'
import { menuConfig } from './menu-provider/menu-config'
import { Switch } from '../index'
import { clearStore } from '@/utils/hooks/use-store'
import { useRouterItem } from '@/utils/hooks/use-routers'

import cx from 'classnames'
import styles from './slide-item.module.scss'

export const SlideMenu = () => {
	const { menus, dispatchMenus } = useMenuContext()
	const { pathname } = useLocation()
	const navigate = useNavigate()
	const [extend, setExtend] = useState<boolean>(false)
	const curRoute = useRouterItem()
	
	const isChildren = !curRoute // 当前页面不在一级页面，则是子页面 -> 显示返回父页面

	const header = (
		<Link
			to={routeMap.home.path}
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
			{isChildren ? (
				<div
					className={styles['slide-menu-bar']}
					onClick={() => {
						navigate(-1)
					}}
				>
					<Icon name="icon-back" size={26} className={styles['slide-menu-bar-icon']} />
				</div>
			) : (
				<div
					className={styles['slide-menu-bar']}
					onClick={() => {
						setExtend(!extend)
					}}
				>
					<Icon name="icon-option" size={26} className={styles['slide-menu-bar-icon']} />
				</div>
			)}
			<nav className={styles['slide-menu-tab']}>
				{header}
				{links}
				{options}
				{footer}
			</nav>
			<div
				onClick={() => {
					setExtend(!extend)
				}}
				className={styles['slide-menu-intro']}
			></div>
		</div>
	)
}
