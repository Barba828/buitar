import * as Tone from 'tone'
import { PolySynth } from 'tone'
import { Instrument } from './instrument.type'
import toneConfig from './tone.config'

require('../../../static/samples/index')

const API_HOST = 'http://localhost:8282'
/**
 * 推断函数入参类型
 */
type GetType<T> = T extends (arg: infer P) => void ? P : string

// const sampler = new Tone.Sampler({
// 	urls: toneConfig['guitar-nylon'],
// 	baseUrl: 'http://localhost:8282/static/samples/guitar-nylon/',
// }).toDestination()

export const tonePlayer = () => {
	//pass in some initial values for the filter and filter envelope
	const synth = new Tone.PolySynth(Tone.Synth).toDestination()

	const now = Tone.now()
	synth.triggerAttackRelease('C4', '8n', now)
	synth.triggerAttackRelease('E4', '8n', now + 0.5)
	synth.triggerAttackRelease('G4', '8n', now + 1)

	// Tone.loaded().then(() => {
	// 	sampler.triggerAttack('G5', 0.5)
	// 	sampler.triggerAttackRelease(['A2', 'G5'], 1.5)
	// })

	// const player = new Tone.Player('./A2.mp3').toDestination()
	// Tone.loaded().then(() => {
	// 	player.start()
	// })
	// const now = Tone.now()

	// synth.triggerAttack('D4', now)
	// synth.triggerAttack('F4', now + 0.5)
	// synth.triggerAttack('A4', now + 1)
	// synth.triggerAttack('C4', now + 1.5)
	// synth.triggerAttack('E4', now + 2)
	// synth.triggerRelease(['D4', 'F4', 'A4', 'C4', 'E4'], now + 4)
}

export class TonePlayer {
	private sampler: Tone.Sampler | PolySynth = new Tone.PolySynth(Tone.Synth).toDestination()
	private instrument: Instrument = 'default'
	private duration: Tone.Unit.Time | Tone.Unit.Time[] = '2n'

	constructor() {}

	public setInstrument(instrument: Instrument) {
		this.instrument = instrument
		if (instrument === 'default') {
			this.sampler = new Tone.PolySynth(Tone.Synth).toDestination()
			return
		}
		this.sampler = new Tone.Sampler({
			urls: toneConfig[instrument],
			baseUrl: `${API_HOST}/static/samples/${instrument}/`,
		}).toDestination()
	}

	/**
	 * 轮播和弦声音
	 * @param notes Tone音值[]
	 * @param duration 轮播间隔时间
	 */
	public triggerAttack = (notes: Tone.Unit.Frequency[], duration: number = 0.3) => {
		const now = Tone.now()
		notes.forEach((note, index) => {
			this.sampler.triggerAttack(note, now + index * duration)
		})
		this.sampler.triggerRelease(notes, now + notes.length * 2 * 0.3)
	}

	/**
	 * 播放声音，默认1/2拍后自动释放
	 * @param note Tone音值 | Tone音值[]
	 */
	public triggerAttackRelease = (note: Parameters<typeof this.sampler.triggerAttackRelease>[0]) => {
		this.sampler.triggerAttackRelease(note, this.duration)
	}
}
