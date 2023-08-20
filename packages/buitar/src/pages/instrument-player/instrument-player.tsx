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
import { DrumPlayer } from '@buitar/tone-player'


export const InstrumentPlayer = () => {
	const intro = usePagesIntro()
	const { menus } = useConfigContext()
	const { player } = useBoardContext()
	const [part, setPart] = useState(false)
	const [level, setPianoPart] = useState(false)
	let drumPlayer: DrumPlayer = new DrumPlayer('drum')

	const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		console.log('eee onKeyDownonKeyDown', );
	}

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
