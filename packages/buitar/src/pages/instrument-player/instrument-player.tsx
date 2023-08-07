import { useState } from 'react'
import {
	BoardController,
	BoardProvider,
	GuitarBoard,
	PianoBoard,
	useBoardContext,
	usePagesIntro,
} from '@/components'

export const InstrumentPlayer = () => {
	const intro = usePagesIntro()
	const [part, setPart] = useState(false)
	const [level, setPianoPart] = useState(false)

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
	const { player } = useBoardContext()

	return (
		<PianoBoard
			player={player}
			onChangePart={props.onChangePart}
		></PianoBoard>
	)
}
