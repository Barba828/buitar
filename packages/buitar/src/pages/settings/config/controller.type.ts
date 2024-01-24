import { PercussionInstrument, StringsInstrument } from '@buitar/tone-player'

export type GuitarBoardOptionsKey =
	| 'isShowSemitone'
	| 'isSharpSemitone'
	| 'isStickyZero'
	| 'hasLevel'
	| 'isNote'
	| 'hasTag'
	| 'numTag'
	| 'isAllKey'

export type GuitarBoardSetting = Record<GuitarBoardOptionsKey, boolean>
export type InstrumentColor = 'yellow' | 'blue' | 'green' | 'cyan' | 'purple'
export type GuitarBoardThemeKey = 'default' | 'fender'
export type InstrumentKeyboardKey = 'guitar' | 'bass' | 'ukulele'

export type InstrumentUIOption = Record<
	StringsInstrument | PercussionInstrument,
	{
		name_en: string
		name_zh: string
		icon: string
		color: InstrumentColor
	}
>
