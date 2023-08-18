import React, { FC } from 'react'
import { useStore } from '@/utils/hooks/use-store'
import { defaultMenuSetting, MenuKeys } from './menu-config'
import { useIsHoverable, useIsMobile, useIsTouch } from '@/utils/hooks/use-device'

type MenuList = Partial<Record<MenuKeys, boolean>>

type MenuContextType = {
	menus: MenuList
	isMobileDevice: boolean
	isHoverDevice: boolean
	isTouchDevice: boolean
	dispatchMenus: Dispatch<MenuList>
}

const MenuContext = React.createContext<MenuContextType>({} as any)

export const useMenuContext = () => React.useContext(MenuContext)

export const MenuProvider: FC = (props) => {
	const [menus, dispatchMenus] = useStore<MenuList>('menus', defaultMenuSetting)

	const isMobileDevice = useIsMobile()
	const isHoverDevice = useIsHoverable()
	const isTouchDevice = useIsTouch()

	const MenuValue = {
		isMobileDevice,
		isHoverDevice,
		isTouchDevice,
		menus,
		dispatchMenus,
	}
	return <MenuContext.Provider value={MenuValue}>{props.children}</MenuContext.Provider>
}
