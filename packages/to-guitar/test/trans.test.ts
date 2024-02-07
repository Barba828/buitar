import { toDegreeTag, intervalToSemitones, rootToChord, toneToChordType, pitchToChordType } from '../src/index'

describe('trans.js', () => {
	test('toDegreeTag', () => {
		expect(toDegreeTag('1')).toBe('Ⅰ')
		expect(toDegreeTag('1#')).toBe('Ⅰ')
		expect(toDegreeTag('1b')).toBe('Ⅰ')
		expect(toDegreeTag('4b')).toBe('Ⅳ')
		expect(toDegreeTag('4')).toBe('Ⅳ')
	})

	test('intervalToSemitones', () => {
		expect(intervalToSemitones('1')).toBe(0)
		expect(intervalToSemitones('3')).toBe(4)
		expect(intervalToSemitones('3b')).toBe(3)
		expect(intervalToSemitones('5#')).toBe(8)
		expect(intervalToSemitones('8')).toBe(12)
		expect(intervalToSemitones('9')).toBe(14)
	})

	test('rootToChord', () => {
		expect(rootToChord('C')).toMatchObject({
			chord: [0, 4, 7],
			chordType: { name: 'major triad', key: 43 },
		})
		expect(rootToChord('Eb', 'm7')).toMatchObject({
			chord: [3, 6, 10, 1],
			chordType: { name: 'minor seventh chord', key: 343 },
		})
	})

	test('toneToChordType', () => {
		expect(toneToChordType(['C', 'E', 'G'])).toContainEqual(
			expect.objectContaining({
				key: 43,
				tone: 0,
				over: 0,
				name: 'major triad',
			})
		)
		expect(toneToChordType(['D', 'F', 'A', 'Cb'])).toContainEqual(
			expect.objectContaining({
				key: 334,
				tone: 2,
				over: 11,
				name: 'half-diminished seventh chord',
				tag: 'm7(b5)',
			})
		)
	})

	test('pitchToChordType', () => {
		expect(pitchToChordType([2, 6, 9])).toContainEqual(
			expect.objectContaining({
				key: 43,
				tone: 2,
				over: 2,
				name: 'major triad',
			})
		)
	})
})
