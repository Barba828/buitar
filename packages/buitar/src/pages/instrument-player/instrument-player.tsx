import { useState } from 'react'
import {
	BoardOptionsController,
	GuitarBoard,
	PianoBoard,
	DrumBoard,
	useBoardContext,
	useConfigContext,
	usePagesIntro,
	DrumInstrumentController,
	KeyBoardInstrument,
} from '@/components'
import { useDrumBoardContext } from '@/components/drum-board/drum-provider'

export const InstrumentPlayer = () => {
	const intro = usePagesIntro()
	const { menus } = useConfigContext()
	const { player } = useBoardContext()
	const { player: drumPlayer, instrument: drumInstrument } = useDrumBoardContext()
	
	const [part, setPart] = useState(false)
	const [level, setPianoPart] = useState(false)

	return (
		<>
			{intro}
			{menus.board_setting && <BoardOptionsController extendItem={false} />}
			<KeyBoardInstrument extendItem={false} />
			<DrumInstrumentController extendItem={false} />

			<GuitarBoard onChangePart={setPart} />
			<PianoBoard onChangePart={setPianoPart} player={player}></PianoBoard>
			<DrumBoard player={drumPlayer} instrument={drumInstrument} />
		</>
	)
}
