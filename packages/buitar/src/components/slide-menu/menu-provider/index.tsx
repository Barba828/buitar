import React, { FC } from 'react'
import { useStore } from '@/utils/hooks/use-store'
import { defaultMenuSetting, MenuKeys } from './menu-config'

type MenuList = { [x in string]: boolean }

type MenuContextType = {
	menus: MenuList
	dispatchMenus: React.Dispatch<{
		type: 'set' | 'init' | 'reset'
		payload: MenuList
	}>
}

const MenuContext = React.createContext<MenuContextType>({} as any)

export const useMenuContext = () => React.useContext(MenuContext)

export const MenuProvider: FC = (props) => {
	const [menus, dispatchMenus] = useStore<MenuList>('menus', defaultMenuSetting)

	const MenuValue = {
		menus,
		dispatchMenus,
	}
	return <MenuContext.Provider value={MenuValue}>{props.children}</MenuContext.Provider>
}
