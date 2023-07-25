import { Board, chordMap } from '../src/index'
import { transBoard, transChordType, transChordTaps, transScaleDegree, transFifthsCircle } from '../src/utils'

describe('Trans', () => {
	test('Trans Methods', () => {
		const board = transBoard()
		// console.log(board.map((item) => item.map((it) => it.toneSchema)))
		expect(typeof board).toBe('object')

		// const circle = transFifthsCircle()
		// console.log(circle)

		// const chords = transChordType([7, 5, 2])
		// const chords = transChordType([6, 2, 3], 2)
		// console.log(chords)

		// const chordsname = transChord('D', 'sus4')
		// console.log(chordsname)
		const scale = transScaleDegree({ chordNumType: 9 })

		// console.log(chordMap.size)
		// console.log(new Set(chordMap.keys()).size)

		// console.log(scale.map((item) => item.chord))

		// const board2 = new Board((board) => {
		// 	// console.log(
		// 	// 	'lnz',
		// 	// 	board.keyboard.map((item) => item[0].toneSchema.note)
		// 	// )
		// })

		// const types = transChordType(['E', 'G', 'B', 'D', 'F#'])
		// const taps = transChordTaps(['A', 'C', 'E', 'G'])
		// const taps = transChordTaps(['E', 'G', 'B'])

		// console.log(taps.chordList.map((item) => item.map((item) => [item.string, item.grade])))
	})
})
