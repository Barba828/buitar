import {
	INTERVAL_FALLING_LIST,
	INTERVAL_LIST,
	NOTE_FALLING_LIST,
	NOTE_LIST,
	ToneSchema,
	ToneTypeName,
} from '@buitar/to-guitar'
import { GuitarBoardSetting } from '@/pages/settings/config/controller.type'

/**
 * 根据指板设置获取 Tone 值
 * @param tone
 * @param options
 * @param ignore 忽视半音
 */
export const getBoardOptionsTone = (
	tone: ToneSchema,
	options: GuitarBoardSetting,
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
 * 根据指板设置获取 Note 值
 * @param tone
 * @param options
 * @returns
 */
export const getBoardOptionsNote = (
	tone: ToneSchema | number,
	options: Pick<GuitarBoardSetting, 'isSharpSemitone'>
) => {
	if (typeof tone === 'number') {
		return options.isSharpSemitone ? NOTE_LIST[tone] : NOTE_FALLING_LIST[tone]
	}
	return options.isSharpSemitone ? tone.note : tone.noteFalling
}

/**
 * 根据指板设置获取 Tone 类型
 * @param options
 * @returns
 */
export const getBoardOptionsToneType = (
	options: Pick<GuitarBoardSetting, 'isSharpSemitone' | 'isNote'>
): ToneTypeName => {
	if (!options) {
		return 'note'
	}
	const { isSharpSemitone = true, isNote = true } = options
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
export const getBoardOptionsList = (
	options: Pick<GuitarBoardSetting, 'isSharpSemitone' | 'isNote'>
) => {
	const { isSharpSemitone, isNote } = options

	return isSharpSemitone
		? isNote
			? NOTE_LIST
			: INTERVAL_LIST
		: isNote
		? NOTE_FALLING_LIST
		: INTERVAL_FALLING_LIST
}
