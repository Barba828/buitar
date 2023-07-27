import React, { FC, useEffect, useMemo, useState } from 'react'
import * as Tone from 'tone'

type SequencerCorntextType = {
	isPlaying: boolean
	setIsPlaying: SetState<boolean>
	editable: boolean
	setEditable: SetState<boolean>
	bpm: number
	setBpm: SetState<number>
	m: number
	setM: SetState<number>

	/**
	 * 1/16分音符格子数量
	 */
	maxLength: number
	/**
	 * 1/16分音符格子宽度
	 */
	itemWidth: number
}

const SequencerCorntext = React.createContext<SequencerCorntextType>({} as any)

/**
 * 获取音序机 Context
 */
export const useSequencerContext = () => React.useContext(SequencerCorntext)

interface SequencerProps {
	/**
	 * 播放拍数
	 */
	defaultM?: number
	/**
	 * 默认节拍
	 */
	defaultBpm?: number
	/**
	 * 可修改播放内容
	 */
	defaultEditable?: boolean
}

export const SequencerProvider: FC<SequencerProps> = ({
	defaultM = 1,
	defaultBpm = 60,
	defaultEditable = true,
	...props
}) => {
	const [isPlaying, setIsPlaying] = useState(false)
	const [editable, setEditable] = useState(defaultEditable)
	const [bpm, setBpm] = useState(defaultBpm)
	const [m, setM] = useState(defaultM)
	const maxLength = useMemo(() => 16 * m, [m]) // 16分音符数量

	// 十六分音符UI宽度
	const itemWidth = useMemo(() => {
		const containerWidth = document.getElementById('app')?.getBoundingClientRect().width
		if (!containerWidth) {
			return 0
		}
		return (containerWidth * 0.8 * 0.9) / maxLength
	}, [document.getElementById('app')?.getBoundingClientRect().width, maxLength])

	useEffect(() => {
		Tone.start()
		return () => {
			Tone.Transport.cancel()
		}
	}, [])

	useEffect(() => {
		Tone.Transport.bpm.value = bpm
		// 1秒内bpm平滑变动到...
		// Tone.Transport.bpm.rampTo(bpm, 1)
	}, [bpm])

	const sequencervalue = {
		isPlaying,
		setIsPlaying,
		editable,
		setEditable,
		bpm,
		setBpm,
		m,
		setM,

		maxLength,
		itemWidth,
	}

	return (
		<SequencerCorntext.Provider value={sequencervalue}>{props.children}</SequencerCorntext.Provider>
	)
}
