import React, { FC } from 'react'
import { usePlayerContext } from '../guitar-player'
import { NOTE_LIST, Point, Tone, transNote } from 'to-guitar'
import { Sequencer } from '../sequencer'
import { useBoardContext } from '../guitar-board'
import styles from './sound-board.module.scss'

export const SoundBoard: FC = () => {
	const { player } = useBoardContext()
	const { soundList } = usePlayerContext()

	return (
		<div>
			<Sequencer
				player={player as any}
				sounds={pointsToSounds(soundList)}
				m={Math.round(soundList.length / 4)}
			/>

			{/* <Sequencer player={player as any} /> */}
		</div>
	)
}

/**
 * Point按位 -> 播放时序数组
 * @param soundList
 * @returns
 */
const pointsToSounds = (soundList: Point[][]) => {
	const soundsMap = new Map()

	// 转换为数组合成数据
	soundList.forEach((sound, index) => {
		sound.forEach((point) => {
			const key = `${point.toneSchema.note}${point.toneSchema.level}`
			const value = [index * 4, index * 4 + 3]
			if (soundsMap.has(key)) {
				soundsMap.get(key).push(value)
			} else {
				soundsMap.set(key, [value])
			}
		})
	})

	const sounds = Array.from(soundsMap.keys())
		.map((key) => {
			return {
				key,
				blocks: soundsMap.get(key),
			}
		})
		.sort((a, b) => {
			const charsA = a.key.split('')
			const charsB = b.key.split('')

			const keyA = charsA.pop()
			const keyB = charsB.pop()

			if (keyA !== keyB) {
				return Number(keyA) - Number(keyB)
			} else {
				return (
					NOTE_LIST.indexOf(transNote(charsA.join('') as Tone)) -
					NOTE_LIST.indexOf(transNote(charsB.join('') as Tone))
				)
			}
		})
		.reverse()

	return sounds
}
