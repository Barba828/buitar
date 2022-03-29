import { Instrument } from '@/utils/tone-player/instrument.type'
import { GuitarBoardOptionsKey } from '../controller.type'

export const optionsUIConfig: { [K in GuitarBoardOptionsKey]: any } = {
	isShowSemitone: {
		checked: {
			name_zh: '半音',
			name_en: 'All Tone',
		},
		unchecked: {
			name_zh: '全音',
			name_en: 'Whole Tone',
		},
		others: {
			intro_zh: '吉他显示',
			intro_en: 'Guitar display',
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
		others: {
			intro_zh: '',
			intro_en: '',
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
		others: {
			intro_zh: '',
			intro_en: '',
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
		others: {
			intro_zh: '',
			intro_en: '',
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
		others: {
			intro_zh: '',
			intro_en: '',
		},
	},
	isAllKey: {
		checked: {
			name_zh: '48键',
			name_en: '48 key',
		},
		unchecked: {
			name_zh: '12键',
			name_en: '12 key',
		},
		others: {
			intro_zh: '键盘显示',
			intro_en: 'Keyboard display',
		},
	},
	isPianoKeyDown: {
		checked: {
			name_zh: '键盘',
			name_en: 'Keyboard',
		},
		unchecked: {
			name_zh: '吉他',
			name_en: 'Guitar',
		},
		others: {
			intro_zh: '按键声音',
			intro_en: 'Key sound',
		},
	},
}

export const instrumentUIConfig: { [K in Instrument]: any } = {
	'bass-electric': {
		name: 'Electric Bass',
		name_zh: '贝斯',
		icon: 'icon-bass',
	},
	'guitar-acoustic': {
		name: 'Acoustic Guitar',
		name_zh: '木吉他',
		icon: 'icon-acoustic-guitar',
	},
	'guitar-electric': {
		name: 'Electric Guitar',
		name_zh: '电吉他',
		icon: 'icon-electric-guitar',
	},
	'guitar-nylon': {
		name: 'Nylon Guitar',
		name_zh: '尼龙吉他',
		icon: 'icon-nylon-guitar',
	},
	piano: {
		name: 'Piano',
		name_zh: '钢琴',
		icon: 'icon-piano',
	},
	default: {
		name: 'synth',
		name_zh: '合成音',
		icon: 'icon-synth',
	},
}
