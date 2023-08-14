import { useState } from 'react'
import {
	BoardController,
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
		<>
			{intro}
			<BoardController extendItem={false}/>
			<GuitarBoard onChangePart={setPart} />
			<PianoBoards onChangePart={setPianoPart} />
		</>
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
