import React, { useEffect } from 'react'
import {
	ChordTapsController,
	BoardProvider,
	useBoardContext,
	DegreeController,
	FifthCircleController,
	DegreeChordController,
} from '@/components/guitar-board'
import { transChordTaps } from 'to-guitar'
import { PlayerProvider } from '@/components/guitar-player'

import styles from './chord-progressions.module.scss'
import { SoundBoard } from '@/components/sound-board'

export const ChordProgressions = () => {
	return (
		<BoardProvider>
			<PlayerProvider>
				<DegreeController />
				<ChordPicker />
				<SoundBoard />
			</PlayerProvider>
		</BoardProvider>
	)
}

const ChordPicker = () => {
	const { guitarBoardOption, chord, setChordTaps } = useBoardContext()

	// 切换和弦：更新指板图列表
	useEffect(() => {
		setChordTaps(transChordTaps(chord, guitarBoardOption.keyboard))
	}, [chord])

	// 指板更新：清除和弦指位列表
	useEffect(() => {
		setChordTaps(null)
	}, [guitarBoardOption])

	return (
		<div className={styles['chord-picker']}>
			<FifthCircleController />
			<div>
				<DegreeChordController />
				<ChordTapsController />
			</div>
		</div>
	)
}
