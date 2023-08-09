import { FC } from 'react'
import { PageIntroType, pagesIntroConfig } from '@/pages/pages.config'
import { useTopRoute } from '@/utils/hooks/use-routers'

import styles from './pages-intro.module.scss'

export const usePagesIntro = () => {
	const curTopRoute = useTopRoute()
	if (!curTopRoute?.id) {
		return null
	}

	const pageInfo = pagesIntroConfig.get(curTopRoute.id)

	if (!pageInfo) {
		return null
	}

	return <PagesIntro {...pageInfo} />
}

export const PagesIntro: FC<PageIntroType> = ({ title, content }) => {
	return (
		<div className={styles['pages-intro']}>
			<h2>{title}</h2>
			{content.map((item, index) => (
				<p key={index}>{item}</p>
			))}
		</div>
	)
}
