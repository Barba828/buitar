import { useMemo, memo } from 'react'
import { useRouteMatch } from '@/utils/hooks/use-routers'
import { Icon } from '@/components/icon'
import { useNavigate } from 'react-router-dom'

import styles from './page-header.module.scss'

export const PageHeader = memo(() => {
	const curRoute = useRouteMatch()
	const navigate = useNavigate()
	const showBack = useMemo(() => !!curRoute?.meta?.back, [curRoute])

	if (showBack) {
		return (
			<header className={styles['page-header']} onClick={() => navigate(-1)}>
				<Icon name="icon-back" size={16}></Icon>
				<h2>{curRoute.name}</h2>
			</header>
		)
	}

	return (
		<header className={styles['page-header']}>
			<h1>{curRoute.name}</h1>
		</header>
	)
})
