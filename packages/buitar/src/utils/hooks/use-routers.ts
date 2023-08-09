import { useLocation, useMatch } from 'react-router-dom'
import { routeConfig, flatRouteConfig } from '@/pages/router'

/**
 * 获取当前路由对象
 * @returns
 */
export const useRouteMatch = () => {
	return flatRouteConfig.filter((item) => useMatch(item.path))?.[0]
}

/**
 * 获取当前路由一级对象
 * @returns
 */
export const useTopRoute = () => {
	const { pathname } = useLocation()
	return routeConfig.find((item) => item.id !== 'Home' && pathname.includes(item.path))
}

/**
 * 获取某id路由对象
 * @param id
 * @returns
 */
export const useRouteFind = (id: string) =>
	flatRouteConfig.find((route) => route.id === id) || routeConfig[0]
