export type MenuItem = {
	name: string
	name_en?: string
	key: MenuKeys
}

export type MenuKeys = 'board_setting' | 'instrument_setting'

export const menuConfig: MenuItem[] = [
	{
		name: '指板设置',
		name_en: 'Board setting',
		key: 'board_setting',
	},
	{
		name: '乐器选择',
		name_en: 'Instrument setting',
		key: 'instrument_setting',
	},
]

export const defaultMenuSetting = {
	board_setting: true,
	instrument_setting: true,
}
