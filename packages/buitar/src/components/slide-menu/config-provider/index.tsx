import React, { FC } from 'react'
import { useStore } from '@/utils/hooks/use-store'
import { defaultMenuSetting, MenuKeys } from './menu-config'
import { useIsHoverable, useIsMobile, useIsTouch } from '@/utils/hooks/use-device'

type MenuList = Partial<Record<MenuKeys, boolean>>

type ConfigContextType = {
	menus: MenuList
	isMobileDevice: boolean
	isHoverDevice: boolean
	isTouchDevice: boolean
	dispatchMenus: Dispatch<MenuList>
}

const ConfigContext = React.createContext<ConfigContextType>({} as any)

export const useConfigContext = () => React.useContext(ConfigContext)

export const ConfigProvider: FC = (props) => {
	const [menus, dispatchMenus] = useStore<MenuList>('menus', defaultMenuSetting)

	const isMobileDevice = useIsMobile()
	const isHoverDevice = useIsHoverable()
	const isTouchDevice = useIsTouch()

	const ConfigValue = {
		isMobileDevice,
		isHoverDevice,
		isTouchDevice,
		menus,
		dispatchMenus,
	}
	return (
		<ConfigContext.Provider value={ConfigValue}>
			{props.children}
		</ConfigContext.Provider>
	)
}
