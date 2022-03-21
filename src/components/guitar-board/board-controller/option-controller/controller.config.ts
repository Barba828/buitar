import { Instrument } from '@/utils/tone-player/instrument.type'
import { GuitarBoardOptionsKey } from '../controller.type'

export const optionsUIConfig: { [K in GuitarBoardOptionsKey]: any } = {
	isShowSemitone: {
		checked: {
			name_zh: '半音',
			name_en: 'All',
		},
		unchecked: {
			name_zh: '全音',
			name_en: 'only-what',
		},
	},
	isSharpSemitone: {
		checked: {
			name_zh: '#',
			name_en: '#',
		},
		unchecked: {
			name_zh: 'b',
			name_en: 'b',
		},
	},
	isNote: {
		checked: {
			name_zh: '音名',
			name_en: 'note',
		},
		unchecked: {
			name_zh: '唱名',
			name_en: 'interval',
		},
	},
	hasLevel: {
		checked: {
			name_zh: '八度',
			name_en: 'Octave',
		},
		unchecked: {
			name_zh: '隐藏',
			name_en: 'hide',
		},
	},
	hasTag: {
		checked: {
			name_zh: '品记',
			name_en: 'Fret tag',
		},
		unchecked: {
			name_zh: '隐藏',
			name_en: 'hide',
		},
	},
}

export const instrumentUIConfig: { [K in Instrument]: any } = {
	'guitar-acoustic': {
		name: 'Acoustic',
		name_zh: '木吉他',
		icon: 'icon-acoustic-guitar',
	},
	'guitar-electric': {
		name: 'Electric',
		name_zh: '电吉他',
		icon: 'icon-electric-guitar',
	},
	'guitar-nylon': {
		name: 'Nylon',
		name_zh: '尼龙吉他',
		icon: 'icon-nylon-guitar',
	},
	default: {
		name: 'Piano',
		name_zh: '钢琴',
		icon: 'icon-piano',
	},
}
