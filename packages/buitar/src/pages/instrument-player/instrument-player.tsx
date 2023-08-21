import { useState } from 'react'
import {
	BoardOptionsController,
	GuitarBoard,
	PianoBoard,
	DrumBoard,
	useBoardContext,
	useConfigContext,
	usePagesIntro,
} from '@/components'


export const InstrumentPlayer = () => {
	const intro = usePagesIntro()
	const { menus } = useConfigContext()
	const { player } = useBoardContext()
	const drumPlayer = window.drumPlayer
	const [part, setPart] = useState(false)
	const [level, setPianoPart] = useState(false)

	return (
		<>
			{intro}
			{menus.board_setting && <BoardOptionsController extendItem={false} />}
			<GuitarBoard onChangePart={setPart} />
			<PianoBoard onChangePart={setPianoPart} player={player}></PianoBoard>
			<DrumBoard player={drumPlayer}/>
		</>

	)
}
