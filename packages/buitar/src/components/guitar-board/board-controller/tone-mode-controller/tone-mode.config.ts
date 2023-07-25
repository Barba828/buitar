import { ModeType } from '@buitar/to-guitar'

export type ModeConfigType = {
	key: ModeType
	title: string
    subTitle?: string
    desc: string
}

export const modeConfigs: ModeConfigType[] = [
	{
		key: 'major',
		title: 'Major',
		subTitle: 'Ionian',
		desc: '自然大调',
	},
	{
		key: 'minor',
		title: 'Minor',
		subTitle: 'Aeolian',
		desc: '自然小调',
	},
	{
		key: 'major-pentatonic',
		title: 'Major',
		subTitle: 'Pentatonic',

		desc: '自然五度大调',
	},
	{
		key: 'minor-pentatonic',
		title: 'Minor',
		subTitle: 'Pentatonic',
		desc: '自然五度小调',
	},
	{
		key: 'major-blues',
		title: 'Major',
		subTitle: 'Blues',
		desc: '布鲁斯大调',
	},
	{
		key: 'minor-blues',
		title: 'Minor',
		subTitle: 'Blues',
		desc: '布鲁斯小调',
	},
]
