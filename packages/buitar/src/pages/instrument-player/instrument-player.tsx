import { useState } from 'react'
import {
	BoardOptionsController,
	GuitarBoard,
	PianoBoard,
	useBoardContext,
	useConfigContext,
	usePagesIntro,
} from '@/components'

export const InstrumentPlayer = () => {
	const intro = usePagesIntro()
	const [part, setPart] = useState(false)
	const [level, setPianoPart] = useState(false)
	const { menus } = useConfigContext()

	return (
		<>
			{intro}
			{menus.board_setting && <BoardOptionsController extendItem={false}/>}
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
