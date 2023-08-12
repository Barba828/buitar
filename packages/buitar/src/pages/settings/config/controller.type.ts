export type GuitarBoardOptionsKey =
	| 'isShowSemitone'
	| 'isSharpSemitone'
	| 'isStickyZero'
	| 'hasLevel'
	| 'isNote'
	| 'hasTag'
	| 'numTag'
	| 'isAllKey'

export type GuitarBoardOptions = Record<GuitarBoardOptionsKey, boolean>
export type InstrumentColor = 'yellow' | 'blue' | 'green' | 'cyan' | 'purple'
export type GuitarBoardThemeKey = 'default' | 'fender'
export type InstrumentKeyboardKey = 'guitar' | 'bass' | 'ukulele'
