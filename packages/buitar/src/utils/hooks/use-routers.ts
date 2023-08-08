import { useMatch } from 'react-router-dom'
import { routeConfig } from '@/pages/router'

/**
 * 获取一级页面对象
 * @returns 
 */
export const useRouterItem = () => {
	return routeConfig.filter((item) => useMatch(item.path))?.[0]
}
