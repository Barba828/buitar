import { Board } from './board/index.js'
import { SINGLE_WIDTH, PADDING, SINGLE_HEIGHT } from './board/index.js'

import { STRING_NUMS, GRADE_NUMS, transChordTaps } from 'to-guitar'
import { typesChecker } from './widgets/types-checker.js'
import { chordsChecker } from './widgets/chords-checker.js'

var imgSrc = require('../src/1000.jpg')

import * as Tone from 'tone'

let allButton = false
const allButtonCheck = document.getElementById('all-button-check')

const app = () => {
	const canvas = document.getElementById('canvas') as HTMLCanvasElement
	const synth = new Tone.Synth().toDestination()

	if (canvas) {
		canvas.width = SINGLE_WIDTH * (STRING_NUMS - 1) + PADDING * 2
		canvas.height = SINGLE_HEIGHT * (GRADE_NUMS - 1) + PADDING * 2

		const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
		const board = new Board(ctx, canvas)

		board.addButtonListener('change', (btn) => {
			console.log('onChange', btn.point.toneSchema.note)
			synth.triggerAttackRelease(`${btn.point.toneSchema.note}4`, '8n')
		})
		board.addButtonListener('mousemove', (btn) => {
			// console.log('onMousemove', btn);
		})
		board.draw()

		allButtonCheck?.addEventListener('change', () => {
			allButton = !allButton
			board.drawSetOptions(allButton)
		})

		typesChecker((type) => {
			console.log(type)
			board.boardButtons.forEach((button) => {
				button.setOptions({ pointType: type })
			})
		})

		chordsChecker(transChordTaps(['C', 'E', 'G']).chordList, (chord) => {
			chord
				.map((chordItem) => chordItem.toneSchema.note)
				.forEach((note, index) => {
					setTimeout(() => {
						synth.triggerAttackRelease(`${note}4`, '8n')
					}, index * 200)
				})
			board.drawSetOptions2(chord)
		})
	}
}

// const app = () => {
// 	//pass in some initial values for the filter and filter envelope
// 	const synth = new Tone.PolySynth(Tone.Synth).toDestination()
// 	const btn = document.createElement('button')
// 	btn.textContent = 'play'
// 	document.getElementById('app')?.appendChild(btn)

// 	const sampler = new Tone.Sampler({
// 		urls: {
// 			A2: 'A2.mp3',
// 			E2: 'E2.mp3',
// 			G5: 'G5.mp3',
// 			// 'D#4': 'Ds4.mp3',
// 			// 'F#4': 'Fs4.mp3',
// 			// A4: 'A4.mp3',
// 		},
// 		baseUrl: 'http://localhost:10001/',
// 	}).toDestination()

// 	var img = new Image()
// 	img.src = require('../src/1000.jpg')

// 	document.body.appendChild(img)

// 	btn.addEventListener('click', () => {
// 		Tone.loaded().then(() => {
// 			sampler.triggerAttack('G5', 0.5)
// 			// sampler.triggerAttackRelease(['A2', 'G5'], 1.5)
// 		})

// 		// const player = new Tone.Player('./A2.mp3').toDestination()
// 		// Tone.loaded().then(() => {
// 		// 	player.start()
// 		// })
// 		// const now = Tone.now()

// 		// synth.triggerAttack('D4', now)
// 		// synth.triggerAttack('F4', now + 0.5)
// 		// synth.triggerAttack('A4', now + 1)
// 		// synth.triggerAttack('C4', now + 1.5)
// 		// synth.triggerAttack('E4', now + 2)
// 		// synth.triggerRelease(['D4', 'F4', 'A4', 'C4', 'E4'], now + 4)
// 	})
// }

export { app }
