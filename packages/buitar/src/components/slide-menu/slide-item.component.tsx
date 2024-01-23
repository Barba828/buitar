import { useCallback, useState, memo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Icon, Modal, toast } from '@/components'
import { routeConfig } from '@/pages/router'
// import { useConfigContext } from './index'
// import { menuConfig } from './config-provider/menu-config'
import { clearStore } from '@/utils/hooks/use-store'
import { useRouteFind } from '@/utils/hooks/use-routers'
import { useIsMobile } from '@/utils/hooks/use-device'

import cx from 'classnames'
import styles from './slide-item.module.scss'
import { useTouchMove } from '@/utils/hooks/use-touch-move'

export const SlideMenu = memo(() => {
	// const { menus, dispatchMenus } = useConfigContext()
	const { pathname } = useLocation()
	const [extend, setExtend] = useState<boolean>(false)
	const [cleanStoreVisible, setCleanStoreVisible] = useState<boolean>(false)
	const homeRoute = useRouteFind('Home')
	const isMobile = useIsMobile()

	// 移动端处理手势展开tab栏
	const { touchRef, deltaY } = useTouchMove({
		handleTouchMove: (_, deltaY) => {
			if (!isMobile || !touchRef.current) {
				return
			}
			const refStyle = (touchRef.current as HTMLDivElement).style
			refStyle.transition = 'unset' // 停止height变化动画

			if (extend && deltaY > 0) {
				// 下滑，最低不超过 30 px
				refStyle.height = `${Math.max(60 * 3 - deltaY, 30)}px`
			} else if (!extend && deltaY < 0) {
				// 上拉，最高不超过 240 px
				refStyle.height = `${Math.min(60 - deltaY, 240)}px`
			}
		},
		handleTouchEnd: (_, deltaY) => {
			if (!touchRef.current) {
				return
			}

			if (!extend && deltaY < -60) {
				setExtend(true)
			} else if (extend && deltaY > 60) {
				setExtend(false)
			}

			const refStyle = (touchRef.current as HTMLDivElement).style
			refStyle.transition = ''
			refStyle.height = ''
		},
	})

	const toggleExtend = useCallback(() => {
		setExtend(!extend)
	}, [extend])

	const toggleCleanStoreVisible = useCallback(() => {
		setCleanStoreVisible(!cleanStoreVisible)
	}, [cleanStoreVisible])

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
				<div className={styles['slide-menu-nav-item-name']}>{route.name}</div>
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
			{route.meta?.icon && <Icon name={route.meta?.icon} size={18} />}
			<div className={styles['slide-menu-nav-item-name']}>{route.name}</div>
		</Link>
	))

	const footer = [
		<div
			key="clear"
			className={cx(styles['slide-menu-nav-item'])}
			onClick={toggleCleanStoreVisible}
		>
			<Icon size={20} name="icon-save" />
			<div className={styles['slide-menu-nav-item-name']}>清理</div>
			<Modal
				title={'清理缓存'}
				visible={cleanStoreVisible}
				onCancel={toggleCleanStoreVisible}
				onConfirm={() => {
					toggleCleanStoreVisible()
					clearStore()
					toast('清理完成')
				}}
			>
				<div style={{ padding: '4px' }}>确认清理 Buitar 数据？</div>
			</Modal>
		</div>,
		<a
			key="github"
			href="https://github.com/Barba828/buitar"
			className={cx(styles['slide-menu-nav-item'])}
			target="view_window"
		>
			<Icon size={20} name="icon-github" />
			<div className={styles['slide-menu-nav-item-name']}>Github</div>
		</a>,
	]

	const pcTrigger = (
		<div className={styles['slide-menu-trigger']} onClick={toggleExtend}>
			<Icon name="icon-option" size={26} className={styles['slide-menu-trigger-icon']} />
		</div>
	)

	const mobileTrigger = (
		<div className={styles['slide-menu-tab-trigger']} onClick={toggleExtend}>
			<Icon
				name="icon-back"
				size={10}
				className={styles['slide-menu-tab-trigger-icon']}
				style={extend ? { rotate: '-90deg' } : { rotate: '90deg' }}
			></Icon>
		</div>
	)

	return (
		<nav
			id="slide-menu"
			className={cx(styles['slide-menu'], extend && styles['slide-menu__extend'])}
			style={{
				height: `${60 - deltaY.current}px`,
			}}
			ref={touchRef}
		>
			{isMobile && mobileTrigger}
			<div className={cx(styles['slide-menu-nav'])}>
				{!isMobile && pcTrigger}
				{!isMobile && header}
				{isMobile ? tabLinks : links}
				{footer}
			</div>
		</nav>
	)
})
