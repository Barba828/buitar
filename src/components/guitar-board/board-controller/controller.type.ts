export type GuitarBoardOptionsKey =
	| 'isShowSemitone'
	| 'isSharpSemitone'
	| 'hasLevel'
	| 'isNote'
	| 'hasTag'
	| 'isAllKey'
	| 'isPianoKeyDown'
export type GuitarBoardOptions = { [key in GuitarBoardOptionsKey]: boolean }
