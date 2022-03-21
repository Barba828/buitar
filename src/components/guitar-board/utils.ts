import {
	INTERVAL_FALLING_LIST,
	INTERVAL_LIST,
	ModeType,
	NOTE_FALLING_LIST,
	NOTE_LIST,
	ToneSchema,
	ToneTypeName,
} from 'to-guitar'
import { GuitarBoardOptions } from './board-controller/controller.type'

/**
 * 根据指板设置获取 Tone 值
 * @param tone
 * @param options
 * @param ignore 忽视半音
 */
export const getBoardOptionsTone = (
	tone: ToneSchema,
	options: GuitarBoardOptions,
	ignore?: boolean
) => {
	const { isShowSemitone } = options
	const rising = tone.note.length > 1 && !isShowSemitone

	// 忽略升降调半音
	if (rising && ignore) {
		return
	}

	const toneType = getBoardOptionsToneType(options)

	return tone[toneType]
}

/**
 * 根据指板设置获取 Tone 类型
 * @param options
 * @returns
 */
export const getBoardOptionsToneType = (options: GuitarBoardOptions): ToneTypeName => {
	const { isSharpSemitone, isNote } = options
	return isSharpSemitone
		? isNote
			? 'note'
			: 'interval'
		: isNote
		? 'noteFalling'
		: 'intervalFalling'
}

/**
 * 根据指板设置获取 Tone 列表
 * @param options
 * @returns
 */
export const getBoardOptionsList = (options: GuitarBoardOptions, mode: ModeType = 'major') => {
	const { isSharpSemitone, isNote } = options

	const list = isSharpSemitone
		? isNote
			? NOTE_LIST
			: INTERVAL_LIST
		: isNote
		? NOTE_FALLING_LIST
		: INTERVAL_FALLING_LIST

	if (mode === 'major') {
		// 大调直接返回
		return list
	} else {
		const tempList = [...list]
		// 小调重新排序，9个「半音」是A
		const startAm = tempList.splice(9)
		return [...startAm, ...tempList]
	}
}
