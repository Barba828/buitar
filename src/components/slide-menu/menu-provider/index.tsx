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
		'Chord Player': {
			// 和弦库
			顺阶和弦: true,
		},
		'Chord Analyzer': true, // 和弦编辑
		'Chord Progressions': true, // 和弦进行
		'Chord Collection': true, // 收藏
		'Guitar Setting': {
			// 吉他设置
			'Board Visible': true, // 显示指板
			'Board Setting': true, // 指板设置
			'Instrument Setting': true, // 乐器设置
		},
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
