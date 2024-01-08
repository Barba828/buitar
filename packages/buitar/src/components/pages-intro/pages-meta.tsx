import { FC } from 'react'
import { Helmet } from 'react-helmet-async'
import { pagesIntroConfig } from '@/pages/pages.config'
import { useTopRoute, useRouteMatch } from '@/utils/hooks/use-routers'

export const PagesMeta: FC<{ title?: string; decsription?: string }> = ({
	title,
	decsription = '',
}) => {
	const curTopRoute = useTopRoute() // 一级路由
	const curRoute = useRouteMatch()
	if (!curTopRoute?.id) {
		return null
	}

	const pageInfo = pagesIntroConfig.get(curTopRoute.id)

	if (!pageInfo) {
		return null
	}
	const ogTitle = `${title || curRoute.name ||curTopRoute.name || pageInfo.title} - Buitar`
	const ogDescription =
		(decsription || `${pageInfo.title} - ${pageInfo.content.join(',') || 'Buitar'}`).slice(0, 150)
	const ogImage = 'https://i1.wp.com/img.erpweb.eu.org/imgs/2024/01/63842433f6b0627a.png' // https://img.erpweb.eu.org/imgs/2024/01/63842433f6b0627a.png
	return (
		<Helmet>
			<title>{ogTitle}</title>
			<meta name="description" content={ogDescription} />
			<meta property="og:title" content={ogTitle} />
			<meta property="og:description" content={ogDescription} />
			<meta property="og:image" content={ogImage} />
			<link rel="canonical" href={location.href} />
		</Helmet>
	)
}
