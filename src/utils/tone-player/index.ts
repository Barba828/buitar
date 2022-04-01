import { Point } from 'to-guitar'
import * as Tone from 'tone'
import { PolySynth } from 'tone'
import { Instrument } from './instrument.type'
import { instrumentConfig } from './tone.config'

require('~/samples/index')
window.Tone = Tone
/**
 * time
 * 1m: 一个小节
 * 2n: 二分音符
 * 4n: 八分音符
 * 8t: 八分音符三连音
 * Tone.Transport.bpm = 120 节拍
 * Tone.Transport.timeSignature = 3 拍数（3/4拍）
 */

const API_HOST = 'http://localhost:8282'

export class TonePlayer extends Tone.Sampler {
	private sampler: Tone.Sampler | PolySynth = new Tone.PolySynth(Tone.Synth).toDestination()
	private instrument: Instrument = 'default'

	constructor(instrument: Instrument = 'default') {
		super()
		this.dispatchInstrument(instrument)
	}

	/**
	 * 设置乐器，会请求乐器音频文件
	 * @param instrument
	 * @returns
	 */
	public dispatchInstrument(instrument: Instrument) {
		this.instrument = instrument
		// 默认使用 复音合成器 播放
		if (instrument === 'default') {
			this.sampler = new Tone.PolySynth(Tone.Synth).toDestination()
			return Promise.resolve(true)
		}
		// 选择乐器使用 取样器 播放
		this.sampler = new Tone.Sampler({
			urls: instrumentConfig[instrument],
			baseUrl: `static/samples/${instrument}/`,
		}).toDestination()
		return Tone.loaded()
	}

	public getLoad() {
		if (this.instrument === 'default') {
			return true
		}
		return (this.sampler as Tone.Sampler).loaded
	}

	public getInstrument() {
		return this.instrument
	}

	public getContext() {
		return this.sampler
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
	 * 播放to-guitar point 琶音
	 * @param point
	 */
	public triggerPointArpeggio = (point: Point[]) => {
		const notes = point.map(this.transPoint)
		this.triggerAttackArpeggio(notes)
	}

	/**
	 * 播放to-guitar point 音（1/2拍后自动释放）
	 * @param point
	 */
	public triggerPointRelease = (
		point: Point | Point[],
		duration: Tone.Unit.Time | Tone.Unit.Time[] = '2n'
	) => {
		const tones = Array.isArray(point) ? point : [point]
		const notes = Array.from(new Set(tones.map(this.transPoint)))
		this.sampler.triggerAttackRelease(notes, duration)
	}

	private transPoint = (point: Point): Tone.Unit.Frequency => {
		return `${point.toneSchema.note}${point.toneSchema.level}`
	}
}
