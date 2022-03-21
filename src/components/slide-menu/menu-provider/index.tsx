import React, { FC } from 'react'
import { useStore } from '@/utils/hooks/use-store'
type MenuList = { [x in string]: MenuList | boolean }

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
	const [menus, dispatchMenus] = useStore<MenuList>('menus', {
		调式音阶: true,
		吉他设置: true,
		和弦图示: true,
		调式音阶1: true,
		调式音阶2: true,
		调式音阶3: true,
		调式音阶4: true,
	})

	const MenuValue = {
		menus,
		dispatchMenus,
	}
	return <MenuContext.Provider value={MenuValue}>{props.children}</MenuContext.Provider>
}
