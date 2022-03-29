import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import cx from 'classnames'
import styles from './slide-item.module.scss'
import { Icon } from '@/components/icon'
import { useMenuContext } from './index'
import { routeConfig } from '@/pages/router'

export const SlideMenu = () => {
	const { menus, dispatchMenus } = useMenuContext()
	const { pathname } = useLocation()
	const [extend, setExtend] = useState<boolean>(false)

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

	const header = (
		<Link to="/" className={cx(styles['slide-menu-tab-title'])}>
			Buitar
		</Link>
	)

	return (
		<div
			id="slide-menu"
			className={cx(styles['slide-menu'], extend && styles['slide-menu-extend'])}
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
			</div>
			<div
				onClick={() => {
					setExtend(!extend)
				}}
				className={styles['slide-menu-intro']}
			>
				{/* <Icon name="icon-close" size={26} className={styles['slide-menu-bar-icon']} /> */}
			</div>
		</div>
	)
}
