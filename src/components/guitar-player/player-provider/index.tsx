import React, { FC, useEffect, useState } from 'react'
import {
	PROGRESSIONS_KEY,
	progressionsConfig,
	ProgressionsConfig,
} from '@/pages/chord-progressions/progressions.config'
import { useStore } from '@/utils/hooks/use-store'
import { Note, Point } from 'to-guitar'

type PlayerContextType = {
	progressionIndex: number
	setProgressionIndex: SetState<number>
	progressions: ProgressionsConfig[]
	setProgressions: Dispatch<ProgressionsConfig[]>
	soundList: Point[][]
	setSoundList: SetState<Point[][]>
	soundListIndex: number
	setSoundListIndex: SetState<number>
}

const PlayerContext = React.createContext<PlayerContextType>({} as any)

/**
 * 获取播放器 Context
 */
export const usePlayerContext = () => React.useContext(PlayerContext)

export const PlayerProvider: FC = (props) => {
	const [progressionIndex, setProgressionIndex] = useState<number>(0)
	const [progressions, setProgressions] = useStore<ProgressionsConfig[]>(
		PROGRESSIONS_KEY,
		progressionsConfig
	)

	const [soundListIndex, setSoundListIndex] = useState<number>(-1)
	const [soundList, setSoundList] = useState<Point[][]>([])

	const playerValue = {
		progressionIndex,
		setProgressionIndex,
		progressions,
		setProgressions,
		soundList,
		setSoundList,
		soundListIndex,
		setSoundListIndex,
	}
	return <PlayerContext.Provider value={playerValue}>{props.children}</PlayerContext.Provider>
}
