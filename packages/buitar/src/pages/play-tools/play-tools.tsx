import { FC } from 'react'
import { Link } from 'react-router-dom'
import { ControllerList } from '@/components/controller'
import { routeMap } from '@/pages/router'

import styles from './play-tools.module.scss'

export const PlayToolsHome: FC = () => {
	return (
		<ControllerList
			size="large"
			list={routeMap['tools'].children}
			renderListItem={(route) => (
				<Link to={route.path} className={styles['route-item']}>
					{route.name}
				</Link>
			)}
			checkedItem={() => true}
		/>
	)
}