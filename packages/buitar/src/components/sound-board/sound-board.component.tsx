import { FC, useCallback, useEffect, useState } from 'react'
import { usePlayerContext } from '../guitar-player'
import { NOTE_LIST, Point, Tone, transNote } from '@buitar/to-guitar'
import {
	Sequencer,
	SequencerController,
	SequencerProvider,
	Sound,
	useSequencerContext,
} from '../sequencer'
import { useBoardContext } from '../guitar-board'
import cx from 'classnames'
import styles from './sound-board.module.scss'
import { Icon } from '..'

export const SoundBoard: FC = () => {
	return (
		<SequencerProvider defaultEditable={false}>
			<SoundBoardInner />
		</SequencerProvider>
	)
}

const SoundBoardInner = () => {
	const { player } = useBoardContext()
	const { soundList } = usePlayerContext()
	const { setM } = useSequencerContext()
	const [sounds, setSounds] = useState<Sound[]>([])
	const [isSplit, setIsSplit] = useState<boolean>(false)

	useEffect(() => {
		setM(Math.round(soundList.length / 4))
		setSounds(pointsToSounds(soundList, isSplit))
	}, [soundList, isSplit])

	const handleChange = useCallback(() => {
		setIsSplit(!isSplit)
	}, [isSplit])

	return (
		<>
			<SequencerController mVisible={false} onRandom={handleChange}>
			</SequencerController>
			<Sequencer player={player} sounds={sounds} />
		</>
	)
}

/**
 * Point按位 -> 播放时序数组
 * @param soundList
 * @param split 分解和弦
 * @returns
 */
const pointsToSounds = (soundList: Point[][], split?: boolean) => {
	const soundsMap = new Map()

	// 转换为数组合成数据
	soundList.forEach((sound, index) => {
		sound.forEach((point, soundIndex) => {
			const key = `${point.toneSchema.note}${point.toneSchema.level}`
			const offset = split ? (3 + soundIndex) % 4 : 0 // 分解：point音按序十六分开始播放，扫弦：同时开始
			const value = [index * 4 + offset, index * 4 + 3 + offset]
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
