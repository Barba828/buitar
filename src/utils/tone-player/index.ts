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

export class TonePlayer {
	private sampler: Tone.Sampler | PolySynth = new Tone.PolySynth(Tone.Synth).toDestination()
	private instrument: Instrument = 'default'
	private duration: Tone.Unit.Time | Tone.Unit.Time[] = '2n'

	constructor(instrument?: Instrument) {
		this.instrument = instrument || 'default'
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
			return Promise.resolve()
		}
		// 选择乐器使用 取样器 播放
		this.sampler = new Tone.Sampler({
			urls: instrumentConfig[instrument],
			baseUrl: `static/samples/${instrument}/`,
		}).toDestination()
		return Tone.loaded()
	}

	public getInstrument() {
		return this.instrument
	}

	public getSampler() {
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
	 * 播放声音，默认1/2拍后自动释放
	 * @param note Tone音值 | Tone音值[]
	 */
	public triggerAttackRelease = (
		note: Parameters<typeof this.sampler.triggerAttackRelease>[0],
		duration?: Parameters<typeof this.sampler.triggerAttackRelease>[1],
		time?: Parameters<typeof this.sampler.triggerAttackRelease>[2]
	) => {
		this.sampler.triggerAttackRelease(note, duration || this.duration, time)
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
	public triggerPointRelease = (point: Point | Point[]) => {
		const tones = Array.isArray(point) ? point : [point]
		const notes = tones.map(this.transPoint)
		this.triggerAttackRelease(notes)
	}

	private transPoint = (point: Point): Tone.Unit.Frequency => {
		return `${point.toneSchema.note}${point.toneSchema.level}`
	}
}
