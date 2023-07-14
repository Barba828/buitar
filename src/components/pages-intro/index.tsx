import { PageIntroType, pagesIntroConfig } from '@/pages/pages.config'
import React, { FC } from 'react'
import { useLocation } from 'react-router-dom'

import styles from './pages-intro.module.scss'

export const usePagesIntro = () => {
	const { pathname } = useLocation()
	if (!pathname || !pagesIntroConfig.has(pathname)) {
		return null
	}

	const pageInfo = pagesIntroConfig.get(pathname)!

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
