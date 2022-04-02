export type GuitarBoardOptionsKey =
	| 'isShowSemitone'
	| 'isSharpSemitone'
	| 'hasLevel'
	| 'isNote'
	| 'hasTag'
	| 'isAllKey'
export type GuitarBoardOptions = { [key in GuitarBoardOptionsKey]: boolean }
