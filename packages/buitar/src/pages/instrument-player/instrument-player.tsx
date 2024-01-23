import { useState } from 'react'
import {
	GuitarBoard,
	PianoBoard,
	DrumBoard,
	PagesMeta,
	useBoardContext,
	DrumInstrumentController,
	KeyBoardInstrument,
} from '@/components'
import { useDrumBoardContext } from '@/components/drum-board/drum-provider'

export const InstrumentPlayer = () => {
	const { player } = useBoardContext()
	const { player: drumPlayer, instrument: drumInstrument } = useDrumBoardContext()

	const [part, setPart] = useState(false)
	const [level, setPianoPart] = useState(false)

	return (
		<>
			<PagesMeta />
			<KeyBoardInstrument extendItem={false} />
			<DrumInstrumentController extendItem={false} />

			<GuitarBoard onChangePart={setPart} />
			<PianoBoard onChangePart={setPianoPart} player={player}></PianoBoard>
			<DrumBoard player={drumPlayer} instrument={drumInstrument} />
		</>
	)
}
