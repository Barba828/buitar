import { memo } from 'react'
import { pagesIntroConfig } from '@/pages/pages.config'
import { useTopRoute } from '@/utils/hooks/use-routers'

import styles from './pages-intro.module.scss'

/**
 * 页面介绍
 */
export const PagesIntro = memo(() => {
	const curTopRoute = useTopRoute()
	if (!curTopRoute?.id) {
		return null
	}

	const pageInfo = pagesIntroConfig.get(curTopRoute.id)

	if (!pageInfo) {
		return null
	}

	const { title, content } = pageInfo

	return (
		<section className={styles['pages-intro']}>
			<h2>{title}</h2>
			{content.map((item, index) => (
				<p key={index}>{item}</p>
			))}
		</section>
	)
})
