import { Board } from '../src/index'

describe('board.js', () => {
	const board = new Board()
	test('Board based on C', () => {
		expect(board.notes[0]).toBe('C')
		expect(board.chords[1].note).toBe('D')
		expect(board.chords[1].interval).toBe(2)
		expect(board.keyboard[1][3].note).toBe('C')
		expect(board.keyboard[1][3].tone).toBe(0)
	})
	test('Board based on D#', () => {
		board.setOptions({scale: 'D#'})
		expect(board.notes[0]).toBe('Eb')
		expect(board.notesOnC[1]).toBe('Db')
		expect(board.chords[0].note).toBe('Eb')
		expect(board.chords[0].interval).toBe(0)
		expect(board.keyboard[1][3].note).toBe('C')
		expect(board.keyboard[1][3].tone).toBe(0)
	})
})
