export type GuitarBoardOptionsKey =
	| 'isShowSemitone'
	| 'isSharpSemitone'
	| 'isStickyZero'
	| 'hasLevel'
	| 'isNote'
	| 'hasTag'
	| 'numTag'
	| 'isAllKey'

export type GuitarBoardThemeKey = 'default' | 'fender'

export type GuitarBoardOptions = Record<GuitarBoardOptionsKey, boolean>
