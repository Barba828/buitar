import React, { useState } from 'react'
import {
	BoardController,
	BoardProvider,
	GuitarBoard,
	PianoBoard,
	useBoardContext,
	usePagesIntro,
} from '@/components'
import { useIsMobile } from '@/utils/hooks/use-device'

export const InstrumentPlayer = () => {
	const intro = usePagesIntro()
	const [part, setPart] = useState(false)
	const [level, setPianoPart] = useState(false)
	const isMobile = useIsMobile()

	return (
		<BoardProvider>
			{intro}
			<BoardController extendItem={false}/>
			<GuitarBoard onChangePart={setPart} />
			<PianoBoards onChangePart={setPianoPart} />
		</BoardProvider>
	)
}

const PianoBoards = (props: any) => {
	const { player, resumePlayer } = useBoardContext()

	return (
		<PianoBoard
			player={player}
			resumePlayer={resumePlayer}
			onChangePart={props.onChangePart}
		></PianoBoard>
	)
}
