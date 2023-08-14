import { BoardChord } from "@buitar/to-guitar"
import { GuitarBoardOptions } from '@/pages/settings/config/controller.type'
import { getBoardOptionsNote } from '@/components/guitar-board/utils'


/**
 * 根据 chordType 获取和弦名称
 * @param chordType
 * @param boardOptions
 * @returns
 */
export const getBoardChordName = (
	chordType?: BoardChord['chordType'],
	boardOptions?: Pick<GuitarBoardOptions, 'isSharpSemitone'>
) => {
	if (!chordType) {
		return ''
	}
	// 自定义名称直接返回
	if (chordType.tag === '*') {
		return chordType.name
	}

	// 根据 tone 获取和弦名称
	if (!chordType.tone) return ' '
	const tone = boardOptions
		? getBoardOptionsNote(chordType.tone, boardOptions)
		: chordType.tone.note
	const over = chordType.over
		? boardOptions
			? getBoardOptionsNote(chordType.over, boardOptions)
			: chordType.over.note
		: ''
	const tag = chordType.tag
	if (over === tone) {
		return `${tone}${tag}`
	} else {
		return `${over}${tag}/${tone}`
	}
}