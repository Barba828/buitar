import { StringsInstrument } from '@buitar/tone-player'
import {
	GuitarBoardOptionsKey,
	GuitarBoardThemeKey,
	InstrumentKeyboardKey,
	InstrumentUIOption,
} from './controller.type'
import type { BoardOption } from '@buitar/to-guitar'

/**useStore Keys*/
export const OPTIONS_KEY = 'options'
export const INSTRUMENT_STRINGS_KEY = 'instrument_strings'
export const INSTRUMENT_PERCUSSION_KEY = 'instrument_percussion'
export const BOARD_THEME_KEY = 'board_theme'
export const INSTRUMENT_KEYBOARD_KEY = 'instrument_keyboard'

export const optionsUIConfig: Record<GuitarBoardOptionsKey, any> = {
	isShowUnActive: {
		checked: {
			name_zh: '显示',
			name_en: 'Whole Tone',
		},
		unchecked: {
			name_zh: '隐藏',
			name_en: 'Inner Tone',
		},
		others: {
			intro_zh: '非活动指板音',
			intro_en: 'Guitar Display',
		},
	},
	isShowOuter: {
		checked: {
			name_zh: '显示全部',
			name_en: 'Whole Tone',
		},
		unchecked: {
			name_zh: '仅调内音',
			name_en: 'Inner Tone',
		},
		others: {
			intro_zh: '调内指板音',
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
	hasInterval: {
		checked: {
			name_zh: '级数',
			name_en: 'Interval',
		},
		unchecked: {
			name_zh: '八度',
			name_en: 'Octave',
		},
		others: {
			intro_zh: '附属显示',
			intro_en: 'Guitar Display',
		},
	},
	isRomanInterval: {
		checked: {
			name_zh: '罗马数字',
			name_en: 'Roman',
		},
		unchecked: {
			name_zh: '数字',
			name_en: 'number',
		},
		others: {
			intro_zh: '级数显示',
			intro_en: 'Interval Display',
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

export const instrumentUIConfig: InstrumentUIOption = {
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

	drum: {
		name_en: 'Drum',
		name_zh: '套鼓',
		icon: 'icon-drumkit',
		color: 'blue',
	},
	'drum-acounstic': {
		name_en: 'Acounstic Drum',
		name_zh: '原声鼓',
		icon: 'icon-drum',
		color: 'green',
	},
	'drum-electronic': {
		name_en: 'Electronic Drum',
		name_zh: '电音鼓',
		icon: 'icon-drum-electronic',
		color: 'cyan',
	},
	'metronome': {
		name_en: 'Metronome',
		name_zh: '节拍器',
		icon: 'icon-metronome',
		color: 'purple',
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

/**默认弦乐指板设置 */
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
		chordOver: false
	},
	ukulele: {
		key: 'ukulele',
		name: '尤克里里',
		baseFret: 17, // 0~16品
		baseTone: ['G4', 'C4', 'E4', 'A4'], // 0 品绝对调音，不需要 baseLevel
		chordOver: true, // 需要带转位和弦
	},
	bass: {
		key: 'bass',
		name: '贝斯',
		baseFret: 17, // 0~16品
		baseLevel: 1, // 基础音高 E2
		baseTone: ['E', 'A', 'D', 'G'], // 0 品调音
		chordOver: false
	},
}

/**默认乐器对应音色 */
export const instrumentKeyboardMap = new Map<InstrumentKeyboardKey, StringsInstrument>(
	[
		['guitar', 'guitar-acoustic'],
		['ukulele', 'ukulele'],
		['bass', 'bass-electric'],
	]
)
