import { Sound } from '@/components'
import { instrumentUIConfig } from '@/pages/settings/config/controller.config'
import type { Instrument, PercussionInstrument } from '@buitar/tone-player'
import {
	DrumPlayer,
	TonePlayer,
	instrumentConfig,
	isPercussionInstrument,
	isStringsInstrument,
} from '@buitar/tone-player'
import { useCallback, useReducer } from 'react'
import { InstrumentColor } from '@/pages/settings/config/controller.type'

export type SequencersState = {
	sequencerPlayer: TonePlayer
	color: InstrumentColor
	sounds: Sound[]
}

export type SequencerReducerType = 'add' | 'delete' | 'instrument' | 'mute' | 'solo' | 'volume'
export type SequencerReducerPayload = {
	index: number
	instrument?: Instrument
	volume?: number
	turn?: boolean
}

export const useSequencerReducer = () => {
	/**
	 * 当组件重新渲染时，会重新创建 Reducer
	 * 因此会导致dispatch执行两次，需要使用useRef/useCallback保证reducer不可变属性
	 *
	 * But
	 * react的假设是，reducer通常会足够快（它们不能处理任何副作用，不能进行api调用，等）
	 * 为了避免不必要的重渲染，需要在某些场景中重新执行它们的风险是值得的
	 * 如果在元素下面有一个带有reducer的大型元素层次结构，这可能比重建reducer要贵得多
	 */
	const reducer = useCallback(
		(
			sequencers: SequencersState[],
			action: {
				type: SequencerReducerType
				payload: SequencerReducerPayload
			}
		) => {
			let player =
				action.payload.index < sequencers.length
					? sequencers[action.payload.index]?.sequencerPlayer
					: null
			switch (action.type) {
				case 'add':
					const newPlayer = new TonePlayer('guitar-acoustic')
					return [
						...sequencers,
						{
							sequencerPlayer: newPlayer,
							color: instrumentUIConfig[newPlayer.getInstrument()].color,
							sounds: getEmptyStringSounds(),
						},
					]

				case 'delete':
					sequencers.splice(action.payload.index, 1)
					return [...sequencers]

				case 'instrument':
					if (!action.payload.instrument || !player) {
						return sequencers
					}

					// 乐器类型相同：切换音色 & 显示颜色
					if (isSameTypeInstrument(player.getInstrument(), action.payload.instrument)) {
						player.dispatchInstrument(action.payload.instrument) 		// 1. 音色
						sequencers[action.payload.index].color =
							instrumentUIConfig[action.payload.instrument].color 	// 2. 颜色
						if (isPercussionInstrument(action.payload.instrument)) { 	// 3. 鼓乐sounds
							sequencers[action.payload.index].sounds = getEmptyPercussionSounds(
								action.payload.instrument
							)
						}
						return [...sequencers]
					}

					const newSequencer = {
						sequencerPlayer: player,
						color: instrumentUIConfig[action.payload.instrument].color,
						sounds: [],
					} as SequencersState
					// 乐器类型不同：新的乐器实例
					if (isPercussionInstrument(action.payload.instrument)) {
						newSequencer.sequencerPlayer = new DrumPlayer(action.payload.instrument)
						newSequencer.sounds = getEmptyPercussionSounds(action.payload.instrument)
					} else {
						newSequencer.sequencerPlayer = new TonePlayer(action.payload.instrument)
						newSequencer.sounds = getEmptyStringSounds()
					}

					sequencers[action.payload.index] = newSequencer
					return [...sequencers]

				case 'mute':
					if (!player) {
						return sequencers
					}

					player.getContext().volume.value = action.payload.turn ? 0 : -Infinity
					return [...sequencers]

				case 'solo':
					if (!player) {
						return sequencers
					}

					if (action.payload.turn) {
						player.getContext().volume.value = 0
						sequencers.forEach((sequencer, idx) => {
							if (idx !== action.payload.index) {
								sequencer.sequencerPlayer.getContext().volume.value = -Infinity
							}
						})
					} else {
						sequencers.forEach((sequencer, idx) => {
							if (idx !== action.payload.index) {
								sequencer.sequencerPlayer.getContext().volume.value = 0
							}
						})
					}
					return [...sequencers]

				case 'volume':
					if (!player || !action.payload.volume) {
						return sequencers
					}

					player.getContext().volume.value = action.payload.volume
					return [...sequencers]

				default:
					return sequencers
			}
		},
		[]
	)

	const [sequencers, dispatch] = useReducer(reducer, null, getSequencersStateFromStore)

	return [sequencers, dispatch] as const
}

const isSameTypeInstrument = (a: string, b: string) => {
	return (
		(isPercussionInstrument(a) && isPercussionInstrument(b)) ||
		(isStringsInstrument(a) && isStringsInstrument(b))
	)
}

/**
 * 默认弦乐空sounds
 */
const getEmptyStringSounds = (
	keys: string[] = ['C4', 'B3', 'A3', 'G3', 'F3', 'E3', 'D3', 'C3']
) => {
	return keys.map((key) => ({
		key,
		blocks: [],
	}))
}

/**
 * 默认鼓乐空sounds
 */
const getEmptyPercussionSounds = (instrument: PercussionInstrument) => {
	return Object.keys(instrumentConfig[instrument]).map((key) => ({
		key,
		blocks: [],
	}))
}

export const setSequencersStateToStore = (sequencers: SequencersState[]) => {
	const data = sequencers.map((sequencer) => ({
		instrument: sequencer.sequencerPlayer.getInstrument(),
		sounds: sequencer.sounds,
	}))
	localStorage.setItem('sequencers', JSON.stringify(data))
}

/**获取初始 sequencers 数据 */
export const getSequencersStateFromStore = () => {
	const data = JSON.parse(localStorage.getItem('sequencers') || '[]') as any[]
	// 从storage中读取sequencers数据
	if (data.length > 0) {
		const sequencers = data.map((item) => {
			const defaultPlayer = new TonePlayer(item.instrument || 'guitar-acoustic')
			return {
				sequencerPlayer: defaultPlayer,
				color: instrumentUIConfig[defaultPlayer.getInstrument()].color,
				sounds: item.sounds || getEmptyStringSounds(),
			}
		})
		return sequencers
	}

	// 新建
	const defaultPlayer = new TonePlayer('guitar-acoustic')
	const defaultValue = [
		{
			sequencerPlayer: defaultPlayer,
			color: instrumentUIConfig[defaultPlayer.getInstrument()].color,
			sounds: getEmptyStringSounds(),
		},
	]
	return defaultValue
}
