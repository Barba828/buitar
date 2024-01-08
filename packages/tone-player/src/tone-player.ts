import * as Tone from 'tone'
import { instrumentConfig, instrumentType } from './tone.config'
import type { Instrument, StringsInstrument } from './instrument.type'
import type { Point } from '@buitar/to-guitar'

/**
 * time
 * 1m: 一个小节 measure
 * 2n: 二分音符 note
 * 4n: 四分音符 note
 * 8t: 八分音符三连音 triplet
 * Tone.Transport.bpm = 120 节拍
 * Tone.Transport.timeSignature = 3 拍数（3/4拍）
 */
export class TonePlayer extends Tone.Sampler {
	private _sampler: Tone.Sampler | Tone.PolySynth = new Tone.PolySynth(Tone.Synth).toDestination()
	private instrument: Instrument = 'default'
	static baseUrl: String = '/'

	constructor(instrument: Instrument = 'default', baseUrl?: string) {
		super()
		this.dispatchInstrument(instrument, baseUrl)
	}

	public get Tone(): any {
		return Tone
	}

	/**
	 * 设置乐器，会请求乐器音频文件
	 * @param instrument 乐器
	 * @param baseUrl 音频文件base地址
	 * @returns
	 */
	public dispatchInstrument(instrument: Instrument, baseUrl?: string) {
		if (instrument === this.instrument) {
			return Promise.resolve()
		}
		if (!isStringsInstrument(instrument)) {
			return Promise.reject()
		}

		this.setInstrument(instrument)
		TonePlayer.setBaseUrl(baseUrl) // 更新静态baseUrl
		if (instrument !== 'default') {
			// 选择乐器使用 Sampler取样器 播放
			this._sampler = new Tone.Sampler({
				urls: instrumentConfig[instrument],
				baseUrl: `${TonePlayer.baseUrl}${instrument}/`,
			}).toDestination()
			this._sampler.context.resume()
			return Tone.loaded()
		} else {
			// 默认使用 复音合成器 播放
			this._sampler = new Tone.PolySynth(Tone.Synth).toDestination()
			return Promise.resolve()
		}
	}

	public get loaded(): boolean {
		if (this.instrument === 'default') {
			return true
		}
		return (this._sampler as Tone.Sampler).loaded
	}

	static setBaseUrl(baseUrl?: string) {
		if (!baseUrl || typeof baseUrl !== 'string') {
			return
		}
		TonePlayer.baseUrl = baseUrl
		return TonePlayer.baseUrl
	}

	public setInstrument(instrument: Instrument) {
		this.instrument = instrument
	}

	public getInstrument() {
		return this.instrument
	}

	public getContext() {
		return this._sampler
	}

	/**
	 * 手动处理 invoke (默认静音)
	 */
	public async resume() {
		await this._sampler.context.resume()
		await Tone.start()
		await Tone.context.resume()
	}

	/**
	 * 播放琶音
	 * @param notes Tone音值[]
	 * @param duration 轮播间隔时间
	 * @example 扫弦 triggerAttack(['D4', 'F4', 'A4', 'C4', 'E4'], 0.005)
	 */
	public triggerAttackArpeggio = (notes: Tone.Unit.Frequency[], duration: number = 0.3) => {
		if (!this.loaded) {
			return
		}

		const now = Tone.now()
		notes.forEach((note, index) => {
			this._sampler.triggerAttack(note, now + index * duration)
		})
		this._sampler.triggerRelease(notes, now + notes.length * 2 * 0.3)
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
	 * 播放to-guitar point 扫弦音
	 * @param point
	 */
	public triggerPointSweeps = (point: Point[]) => {
		const notes = point.map(this.transPoint)
		this.triggerAttackArpeggio(notes, 0.03)
	}

	/**
	 * 播放to-guitar point 音（1/2拍后自动释放）
	 * @param point
	 */
	public triggerPointRelease = (
		point: Point | Point[],
		duration: Tone.Unit.Time | Tone.Unit.Time[] = '2n'
	) => {
		if (!this.loaded) {
			return
		}
		const tones = Array.isArray(point) ? point : [point]
		const notes = Array.from(new Set(tones.map(this.transPoint)))
		this._sampler.triggerAttackRelease(notes, duration)
	}

	private transPoint = (point: Point): Tone.Unit.Frequency => {
		return `${point.toneSchema.note}${point.toneSchema.level}`
	}
}

const isStringsInstrument = (x: Instrument): x is StringsInstrument => {
	return instrumentType.strings.includes(x)
}
