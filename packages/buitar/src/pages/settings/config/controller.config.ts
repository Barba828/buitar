import { Instrument } from '@buitar/tone-player'
import {
	GuitarBoardOptionsKey,
	GuitarBoardThemeKey,
	InstrumentColor,
	InstrumentKeyboardKey,
} from './controller.type'
import type { BoardOption } from '@buitar/to-guitar'

/**useStore Keys*/
export const OPTIONS_KEY = 'options'
export const INSTRUMENT_KEY = 'instrument'
export const BOARD_THEME_KEY = 'board_theme'
export const INSTRUMENT_KEYBOARD_KEY = 'instrument_keyboard'

export const optionsUIConfig: Record<GuitarBoardOptionsKey, any> = {
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
			intro_en: 'Guitar Display',
		},
	},
	isStickyZero: {
		checked: {
			name_zh: '固定 0 品',
			name_en: 'Sticky Zero Fret',
		},
		unchecked: {
			name_zh: '滚动指板',
			name_en: 'Scroll Fret',
		},
		others: {
			intro_zh: '',
			intro_en: '',
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
			name_zh: '音级',
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
			intro_zh: '吉他显示',
			intro_en: 'Guitar Display',
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
			intro_zh: '吉他显示',
			intro_en: 'Guitar Display',
		},
	},
	numTag: {
		checked: {
			name_zh: '数字',
			name_en: 'num tag',
		},
		unchecked: {
			name_zh: '圆点',
			name_en: 'dot tag',
		},
		others: {
			intro_zh: '品记',
			intro_en: 'Fret Tag',
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
}

export const instrumentUIConfig: {
	[K in Instrument]: {
		name_en: string
		name_zh: string
		icon: string
		color: InstrumentColor
	}
} = {
	'guitar-acoustic': {
		name_en: 'Acoustic Guitar',
		name_zh: '木吉他',
		icon: 'icon-acoustic-guitar',
		color: 'yellow',
	},
	'guitar-electric': {
		name_en: 'Electric Guitar',
		name_zh: '电吉他',
		icon: 'icon-electric-guitar',
		color: 'blue',
	},
	'guitar-nylon': {
		name_en: 'Nylon Guitar',
		name_zh: '尼龙吉他',
		icon: 'icon-nylon-guitar',
		color: 'green',
	},
	'bass-electric': {
		name_en: 'Electric Bass',
		name_zh: '贝斯',
		icon: 'icon-bass',
		color: 'cyan',
	},
	piano: {
		name_en: 'Piano',
		name_zh: '钢琴',
		icon: 'icon-piano',
		color: 'purple',
	},
	ukulele: {
		name_en: 'Ukulele',
		name_zh: '尤克里里',
		icon: 'icon-ukulele',
		color: 'green'
	},
	default: {
		name_en: 'synth',
		name_zh: '合成音',
		icon: 'icon-synth',
		color: 'yellow',
	},
}

export const boardStyleConfig: Record<GuitarBoardThemeKey, any> = {
	default: {
		name: '默认',
	},
	fender: {
		name: '芬达',
	},
}

export const instrumentKeyboardConfig: Record<
	InstrumentKeyboardKey,
	{ key: InstrumentKeyboardKey; name: string } & Partial<BoardOption>
> = {
	guitar: {
		key: 'guitar',
		name: '吉他',
		baseFret: 17, // 0~16品
		baseLevel: 2, // 基础音高 E2
		baseTone: ['E', 'A', 'D', 'G', 'B', 'E'], // 0 品调音
	},
	ukulele: {
		key: 'ukulele',
		name: '尤克里里',
		baseFret: 17, // 0~16品
		baseTone: ['G4', 'C4', 'E4', 'A4'], // 0 品调音
		chordOver: true, // 需要带转位和弦
	},
	bass: {
		key: 'bass',
		name: '贝斯',
		baseFret: 17, // 0~16品
		baseLevel: 1, // 基础音高 E2
		baseTone: ['E', 'A', 'D', 'G'], // 0 品调音
	},
}

export const instrumentKeyboardMap = new Map<InstrumentKeyboardKey, Instrument>(
	[
		['guitar', 'guitar-acoustic'],
		['ukulele', 'ukulele'],
		['bass', 'bass-electric'],
	]
)
