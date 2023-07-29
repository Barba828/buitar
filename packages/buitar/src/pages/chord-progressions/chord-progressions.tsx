import { useEffect } from 'react'
import {
	ChordTapsController,
	BoardProvider,
	useBoardContext,
	DegreeController,
	DegreeChordController,
	ChordCard,
	ChordControllerInner,
} from '@/components/guitar-board'
import { Point, transChordTaps, DEGREE_TAG_LIST } from '@buitar/to-guitar'
import { PlayerProvider, usePlayerContext } from '@/components/guitar-player'
import { SoundBoard } from '@/components/sound-board'
import { usePagesIntro } from '@/components'
import { useIsMobile } from '@/utils/hooks/use-device'

import styles from './chord-progressions.module.scss'

export const ChordProgressions = () => {
	const intro = usePagesIntro()
	const isMobile = useIsMobile()
	return (
		<BoardProvider>
			<PlayerProvider>
				{intro}
				<DegreeController />
				<ChordPicker />
				<TapsViewer />
				<SoundBoard />
			</PlayerProvider>
		</BoardProvider>
	)
}

const ChordPicker = () => {
	const { guitarBoardOption, chord, guitar, setChordTaps } = useBoardContext()
	const { soundList, progressionIndex, soundListIndex, setSoundList } = usePlayerContext()

	// 切换和弦：更新指板图列表
	useEffect(() => {
		if (soundListIndex < 0) {
			return
		}
		setChordTaps(transChordTaps(chord, guitarBoardOption.keyboard))
	}, [chord, soundListIndex])

	// 指板更新：清除和弦指位列表
	useEffect(() => {
		setChordTaps(null)
	}, [guitarBoardOption])

	useEffect(() => {
		guitar.setOptions(guitar.board)
	}, [progressionIndex])

	const handleClickTaps = (taps: Point[]) => {
		if (soundListIndex < 0) {
			return
		}
		soundList[soundListIndex] = taps
		setSoundList([...soundList])
	}

	return (
		<ChordControllerInner>
			<DegreeChordController />
			<ChordTapsController onClickTap={handleClickTaps} />
		</ChordControllerInner>
	)
}

const TapsViewer = () => {
	const { soundList, progressionIndex, progressions } = usePlayerContext()
	const isMobile = useIsMobile()
	const progression = progressions[progressionIndex]

	if (!progression || progressionIndex < 0) {
		return null
	}
	return (
		<div className={styles['taps-viewer']}>
			{soundList.map((taps, index) => {
				const grade = progression.procession[index]
				if (!grade) {
					return null
				}
				const name = DEGREE_TAG_LIST[grade.name - 1]
				return (
					<ChordCard
						key={index}
						className={styles['card-view']}
						title={`${name}${grade.tag}`}
						taps={taps}
						size={isMobile ? 100 : 140}
					/>
				)
			})}
		</div>
	)
}
