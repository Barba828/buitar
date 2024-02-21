import { BoardChord } from '@buitar/to-guitar'
import { BoardOption } from '@buitar/to-guitar'

/**
 * 根据 chordType 获取和弦名称
 * @param chordType
 * @param boardSettings
 * @returns
 */
export const getBoardChordName = (chordType?: BoardChord['chordType'], guitarBoardOption?: Partial<BoardOption>) => {
	if (!chordType) {
		return ' '
	}
	// 自定义名称直接返回
	if (chordType.tag === '*') {
		return chordType.name
	}
	// 根据 tone 获取和弦名称
	if (chordType?.tone === undefined || !guitarBoardOption?.notesOnC) {
		return ' '
	}
	const note = guitarBoardOption?.notesOnC[chordType.tone % 12]
	const over = chordType.over ? guitarBoardOption?.notesOnC[chordType.over % 12] : ''
	const tag = chordType.tag
	if (!over || over === note) {
		return `${note}${tag}`
	} else {
		return `${over}${tag}/${note}`
	}
}
