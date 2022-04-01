import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import cx from 'classnames'
import styles from './slide-item.module.scss'
import { Icon } from '@/components/icon'
import { useMenuContext } from './index'
import { routeConfig } from '@/pages/router'
import { menuConfig, MenuKeys } from './menu-provider/menu-config'
import { Switch } from '../index'

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
				<div className={styles['seperate']}></div>
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
