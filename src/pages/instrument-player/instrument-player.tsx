import React, { useState } from 'react'
import {
	BoardController,
	BoardProvider,
	GuitarBoard,
	PianoBoard,
	useBoardContext,
} from '@/components'

export const InstrumentPlayer = () => {
	const [part, setPart] = useState(false)
	const [level, setPianoPart] = useState(false)

	return (
		<BoardProvider>
			<BoardController />
			<GuitarBoard onChangePart={setPart} />
			<PianoBoards onChangePart={setPianoPart} />
		</BoardProvider>
	)
}

const PianoBoards = (props: any) => {
	const {
		player,
		boardOptions: { isPianoKeyDown },
	} = useBoardContext()

	return (
		<PianoBoard
			player={player}
			disableKeydown={!isPianoKeyDown}
			onChangePart={props.onChangePart}
		></PianoBoard>
	)
}
