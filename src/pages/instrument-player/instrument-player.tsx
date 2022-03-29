import React from 'react'
import {
	BoardController,
	BoardProvider,
	GuitarBoard,
	PianoBoard,
	useBoardContext,
} from '@/components'

export const InstrumentPlayer = () => {
	return (
		<BoardProvider>
			<BoardController />
			<GuitarBoard />
			<PianoBoards />
		</BoardProvider>
	)
}

const PianoBoards = () => {
	const {
		player,
		boardOptions: { isPianoKeyDown },
	} = useBoardContext()

	return <PianoBoard player={player} disableKeydown={!isPianoKeyDown}></PianoBoard>
}
