import * as Tone from 'tone'
import { PolySynth } from 'tone'
import { Instrument } from './instrument.type'
import { instrumentConfig } from './tone.config'

require('~/samples/index')

const API_HOST = 'http://localhost:8282'
/**
 * 推断函数入参类型
 */
type GetType<T> = T extends (arg: infer P) => void ? P : string

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
			urls: instrumentConfig[instrument],
			baseUrl: `${API_HOST}/static/samples/${instrument}/`,
		}).toDestination()
	}

	public getInstrument() {
		return this.instrument
	}

	/**
	 * 播放琶音
	 * @param notes Tone音值[]
	 * @param duration 轮播间隔时间
	 * @example 扫弦 triggerAttack(['D4', 'F4', 'A4', 'C4', 'E4'], 0.005)
	 */
	public triggerAttackArpeggio = (notes: Tone.Unit.Frequency[], duration: number = 0.3) => {
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
