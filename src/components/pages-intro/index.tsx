import { PageIntroType, pagesConfif } from '@/pages/pages.config'
import React, { FC } from 'react'
import { useLocation } from 'react-router-dom'

import styles from './pages-intro.module.scss'

export const usePagesIntro = () => {
	const { pathname } = useLocation()
	if (!pathname || !pagesConfif.has(pathname)) {
		return null
	}

	const pageInfo = pagesConfif.get(pathname)!

	return <PagesIntro {...pageInfo} />
}

export const PagesIntro: FC<PageIntroType> = ({ title, content }) => {
	return (
		<div className={styles['pages-intro']}>
			<h2>{title}</h2>
			{content.map((item) => (
				<p>{item}</p>
			))}
		</div>
	)
}
