import React from 'react'
import { Link, useLocation } from 'react-router-dom'

import cx from 'classnames'
import styles from './slide-item.module.scss'
import { Icon } from '@/components/icon'
import { useMenuContext } from './index'
import { routeConfig } from '@/pages/router'

export const SlideMenu = () => {
	const { menus, dispatchMenus } = useMenuContext()
	const { pathname } = useLocation()

	const links = routeConfig.map((route) => (
		<Link
			to={route.path}
			key={route.path}
			className={cx(
				styles['slide-menu-tab-item'],
				pathname === route.path && styles['slide-menu-tab-item-checked']
			)}
		>
			{route.name_zh}
		</Link>
	))

	const options = Object.keys(menus).map((title, index) => {
		const value = typeof menus[title] === 'boolean' && menus[title]
		return (
			<div
				onClick={() => {
					dispatchMenus({ type: 'set', payload: { [title]: !value } })
				}}
				className={cx(
					styles['slide-menu-tab-item'],
					value && styles['slide-menu-tab-item-checked']
				)}
				key={`${index}`}
			>
				{title}
			</div>
		)
	})

	return (
		<div className={styles['slide-menu']}>
			<div className={styles['slide-menu-bar']}>
				<Icon name="icon-option" size={26} className={styles['slide-menu-bar-icon']} />
			</div>
			<div className={styles['slide-menu-tab']}>
				<p className={styles['slide-menu-tab-title']}>Buitar</p>
				{links}
				{options}
			</div>
		</div>
	)
}
