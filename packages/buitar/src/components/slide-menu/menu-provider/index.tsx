import React, { FC, useState } from 'react'
import { useStore } from '@/utils/hooks/use-store'
import { defaultMenuSetting, MenuKeys } from './menu-config'

type MenuList = Partial<Record<MenuKeys, boolean>>

type MenuContextType = {
	menus: MenuList
	dispatchMenus: Dispatch<MenuList>

	// backBtn:Boolean
	// setBackBtn: SetState<Boolean>
}

const MenuContext = React.createContext<MenuContextType>({} as any)

export const useMenuContext = () => React.useContext(MenuContext)

export const MenuProvider: FC = (props) => {
	const [menus, dispatchMenus] = useStore<MenuList>('menus', defaultMenuSetting)
	// const [backBtn, setBackBtn] = useState<Boolean>(false)

	const MenuValue = {
		menus,
		dispatchMenus,
		// backBtn,
		// setBackBtn
	}
	return <MenuContext.Provider value={MenuValue}>{props.children}</MenuContext.Provider>
}
