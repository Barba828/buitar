import { useState, useEffect } from 'react'

/**
 * 判断媒体查询
 * @param query
 * @returns
 */
export const useMediaQuery = (query: string) => {
	const [matches, setMatches] = useState(false)

	useEffect(() => {
		const media = window.matchMedia(query)
		if (media.matches !== matches) {
			setMatches(media.matches)
		}

		const listener = () => setMatches(media.matches)

		media.addEventListener('change', listener)

		return () => media.removeEventListener('change', listener)
	}, [matches, query])

	return matches
}

/**
 * 
 * @returns 判断设备信息
 */
export const useDevice = () => {
	const [deviceInfo, setDeviceInfo] = useState({
		os: 'Unknown',
		browser: 'Unknown',
	})

	useEffect(() => {
		const userAgent = window.navigator.userAgent

		let os, browser

		// Get OS
		if (userAgent.includes('Win')) os = 'Windows'
		else if (userAgent.includes('Mac')) os = 'macOS'
		else if (userAgent.includes('Linux')) os = 'Linux'
		else if (userAgent.includes('Android')) os = 'Android'
		else if (userAgent.includes('like Mac')) os = 'iOS'
		else os = 'Unknown'

		// Get Browser
		if (userAgent.includes('Chrome')) browser = 'Chrome'
		else if (userAgent.includes('Safari')) browser = 'Safari'
		else if (userAgent.includes('Firefox')) browser = 'Firefox'
		else if (userAgent.includes('MSIE') || userAgent.includes('Trident/7.0; rv:11.0'))
			browser = 'Internet Explorer'
		else browser = 'Unknown'

		setDeviceInfo({ os, browser })
	}, [])

	return deviceInfo
}

/**
 * 基于媒体查询获取是否移动设备
 * @media (max-width: 499px)
 */
export const useIsMobile = () => useMediaQuery('(max-width: 499px)')
/**
 * 基于媒体查询获取是否支持Hover
 * @media (any-hover: hover)
 */
export const useIsHoverable = () => useMediaQuery('(any-hover: hover)')
/**
 * 基于媒体查询获取是否支持Touch
 * @media (pointer: coarse)
 */
export const useIsTouch = () => useMediaQuery('(pointer: coarse)')