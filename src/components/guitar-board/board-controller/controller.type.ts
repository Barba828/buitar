export type GuitarBoardOptionsKey =
	| 'isShowSemitone'
	| 'isSharpSemitone'
	| 'hasLevel'
	| 'isNote'
	| 'hasTag'
export type GuitarBoardOptions = { [key in GuitarBoardOptionsKey]: boolean }
