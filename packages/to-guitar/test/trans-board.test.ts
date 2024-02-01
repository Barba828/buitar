import { transChordTaps, transBoard } from '../src/index'

describe('trans-board.js', () => {
	let keyboard = transBoard()

	test('transBoard standard tuning', () => {
		expect(keyboard.map((string) => string[0].note)).toEqual(['E', 'A', 'D', 'G', 'B', 'E'])
		expect(keyboard.map((string) => string[0].pitch)).toEqual([4, 9, 14, 19, 23, 28])
	})
	test('transBoard dropD tuning', () => {
		keyboard = transBoard(['D', 'A', 'D', 'G', 'B', 'E'])
		expect(keyboard.map((string) => string[0].note)).toEqual(['D', 'A', 'D', 'G', 'B', 'E'])
		expect(keyboard[0][2].note).toBe('E')
		expect(keyboard.map((string) => string[0].pitch)).toEqual([2, 9, 14, 19, 23, 28])
	})

	test('transChordTaps C on standard', () => {
		keyboard = transBoard()
		let taps = transChordTaps(['C', 'E', 'G'], { keyboard })
		expect(taps[0].chordType).toMatchObject({ name: 'major triad', key: 43 })
		expect(taps[0].chordTaps[0]).toMatchObject({ string: 2, grade: 3 })

		taps = transChordTaps(['2', '4', '6', '7#'], { keyboard })
		expect(taps[0].chordType).toMatchObject({ name: 'minor seventh chord', key: 343 })
		expect(taps[0].chordTaps[0]).toMatchObject({ string: 3, grade: 0 })
	})
})
