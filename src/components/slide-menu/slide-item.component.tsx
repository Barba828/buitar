import React from 'react'

import cx from 'classnames'
import styles from './slide-item.module.scss'
import { Icon } from '../icon'
import { useMenuContext } from '.'

export const SlideMenu = () => {
	const { menus, dispatchMenus } = useMenuContext()

	return (
		<div className={styles['slide-menu']}>
			<div className={styles['slide-menu-bar']}>
				<Icon name="icon-option" size={26} className={styles['slide-menu-bar-icon']} />
			</div>
			<div className={styles['slide-menu-tab']}>
				<p className={styles['slide-menu-tab-title']}>Buitar</p>
				{Object.keys(menus).map((title, index) => {
					const value = menus[title]
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
				})}
			</div>
		</div>
	)
}
