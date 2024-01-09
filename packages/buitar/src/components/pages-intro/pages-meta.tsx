import { FC } from 'react'
import { Helmet } from 'react-helmet-async'
import { pagesIntroConfig } from '@/pages/pages.config'
import { useTopRoute, useRouteMatch } from '@/utils/hooks/use-routers'

/**
 * 页面元数据
 */
export const PagesMeta: FC<{ title?: string; decsription?: string }> = ({
	title,
	decsription = '',
}) => {
	const curTopRoute = useTopRoute() // 一级路由
	const curRoute = useRouteMatch()
	const pageInfo = pagesIntroConfig.get(curTopRoute?.id || '') // 页面介绍信息

	const ogTitle = `${title || curRoute.name || curTopRoute?.name || pageInfo?.title} - Buitar`
	const ogDescription = (
		decsription ||
		`${pageInfo?.title || curRoute.name} - ${pageInfo?.content.join(',') || 'Buitar'}`
	).slice(0, 150)
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
