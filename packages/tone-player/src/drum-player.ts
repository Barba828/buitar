import * as Tone from 'tone'
import { instrumentConfig, instrumentType } from './tone.config'
import type { PercussionInstrument } from './instrument.type'
import { TonePlayer } from './tone-player'

export class DrumPlayer extends TonePlayer {
	private _players!: Tone.Players

	constructor(instrument: PercussionInstrument = 'drum', baseUrl?: string) {
		super(instrument, baseUrl)
		this.dispatchInstrument(instrument, baseUrl)
	}

	public dispatchInstrument(instrument: PercussionInstrument, baseUrl?: string) {
		DrumPlayer.setBaseUrl(baseUrl) // 更新静态baseUrl
		// 选择乐器使用 Player 播放
		const instrumentDrum = instrumentType.percussion.includes(instrument) ? instrument : 'drum'
		this.setInstrument(instrumentDrum)

		const pathConfig = this.getDrumConfig()
		Object.keys(pathConfig).forEach((key) => {
			pathConfig[key] = `${DrumPlayer.baseUrl}${instrumentDrum}/${pathConfig[key]}`
		})

		this._players = new Tone.Players(pathConfig).toDestination()
		this._players.context.resume()
		return Tone.loaded()
	}

	public get loaded(): boolean {
		return this._players.loaded
	}

	public getPlayers() {
		return this._players
	}

	public getDrumConfig() {
		return { ...instrumentConfig[this.getInstrument()] }
	}

	public triggerDrum = async  (note: string | string[], duration?: Tone.Unit.Time, time?: Tone.Unit.Time, offset?: Tone.Unit.Time) => {
		if (!this.loaded) {
			return
		}
		await Tone.start()
		// await Tone.loaded()

		if (typeof note === 'string') {
			this._players.player(note).start(time, offset, duration)
		} else {
			note.forEach((key) => {
				this._players.player(key).start(time, offset, duration)
			})
		}
	}

	/**
	 * 直接播放note音符
	 * @param note 
	 */
	public triggerNote (note: string, duration?: Tone.Unit.Time, time?: Tone.Unit.Time) {
		this.triggerDrum(note, duration, time)
	}

	static getDrumConfig(instrument: PercussionInstrument) {
		return { ...instrumentConfig[instrument] }
	}
}
