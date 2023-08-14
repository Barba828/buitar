import { useLocation, useMatch } from 'react-router-dom'
import { routeConfig, flatRouteConfig } from '@/pages/router'
import { useMemo } from 'react'

/**
 * 获取当前路由对象
 * @returns
 */
export const useRouteMatch = () => {
	const route = flatRouteConfig.filter((item) => useMatch(item.path))?.[0]
	return route
}

/**
 * 获取当前路由一级对象
 * @returns
 */
export const useTopRoute = () => {
	const { pathname } = useLocation()
	const route = useMemo(
		() => routeConfig.find((item) => item.id !== 'Home' && pathname.includes(item.path)),
		[pathname]
	)
	return route
}

/**
 * 获取某id路由对象
 * @param id
 * @returns
 */
export const useRouteFind = (id: string) => {
	const route = useMemo(() => flatRouteConfig.find((route) => route.id === id) || routeConfig[0], [id])
	return route
}
