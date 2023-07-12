import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import cx from 'classnames'
import styles from './slide-item.module.scss'
import { Icon } from '@/components/icon'
import { useMenuContext } from './index'
import { routeConfig } from '@/pages/router'
import { menuConfig } from './menu-provider/menu-config'
import { Switch } from '../index'
import { clearStore } from '@/utils/hooks/use-store'

export const SlideMenu = () => {
	const { menus, dispatchMenus } = useMenuContext()
	const { pathname } = useLocation()
	const [extend, setExtend] = useState<boolean>(false)

	const header = (
		<Link to={routeConfig[0].path} className={cx(styles['slide-menu-tab-title'])}>
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
				{route.name_zh}
			</Link>
		))

	const options = menuConfig.map((item, index) => {
		const checked = !!menus[item.key]
		return (
			<div className={cx(styles['slide-menu-tab-item'])} key={`${index}`}>
				{item.name_zh}
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
				href="https://github.com/Barba828/Buitar"
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
			<div
				className={styles['slide-menu-bar']}
				onClick={() => {
					setExtend(!extend)
				}}
			>
				<Icon name="icon-option" size={26} className={styles['slide-menu-bar-icon']} />
			</div>
			<div className={styles['slide-menu-tab']}>
				{header}
				{links}
				{options}
				{footer}
			</div>
			<div
				onClick={() => {
					setExtend(!extend)
				}}
				className={styles['slide-menu-intro']}
			></div>
		</div>
	)
}
