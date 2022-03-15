import { ToneSchema } from 'to-guitar'
import { GuitarBoardOptions } from './controller.type'

/**
 * 根据指板设置获取显示内容
 * @param tone
 * @param options
 */
export const getBoardOptionsTone = (tone: ToneSchema, options: GuitarBoardOptions) => {
	const { hasRising, isRising, isNote } = options
	const rising = tone.note.length > 1 && !hasRising

	if (rising) {
		return
	}

	return isRising
		? isNote
			? tone.note
			: tone.interval
		: isNote
		? tone.noteFalling
		: tone.intervalFalling
}
