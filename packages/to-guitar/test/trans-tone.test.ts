import { transPitch } from '../src/index'

describe('trans-tone.js', () => {
	test('transPitch', () => {
		expect(transPitch('C')).toBe(0)
		expect(transPitch('B#')).toBe(0)
		expect(transPitch('D#')).toBe(3)
		expect(transPitch('Gb')).toBe(6)
		expect(transPitch('Cb')).toBe(11)
		expect(transPitch('7#')).toBe(0)
		expect(transPitch('1#')).toBe(1)
		expect(transPitch('1b')).toBe(11)
		expect(transPitch('7')).toBe(11)
		expect(transPitch('7b')).toBe(10)
		expect(transPitch(['C', 'D#', 'Gb', 'Bb', 'E'])).toEqual([0, 3, 6, 10, 4])
		expect(transPitch(['C#', 'D', 'F#', 'A#', 'E'])).toEqual([1, 2, 6, 10, 4])
		expect(transPitch(['G', 'C#', 'Fb'])).toEqual([7, 1, 4])
	})
})
