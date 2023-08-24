import { Sequencer, SequencerController, SequencerProvider, Sound, useBoardContext } from '@/components'
import { FC } from 'react'

export const NotFound: FC = () => {
	const { player } = useBoardContext()
	const sounds = [
		{ key: 'C4', blocks: [] },
		{ key: 'B3', blocks: [] },
		{ key: 'A3', blocks: [] },
		{ key: 'G3', blocks: [] },
		{ key: 'F3', blocks: [] },
		{ key: 'E3', blocks: [] },
		{ key: 'D3', blocks: [] },
		{ key: 'C3', blocks: [] },
	] as Sound[]
	return (
		<SequencerProvider>
			<SequencerController mVisible={false}></SequencerController>
			<Sequencer player={player} sounds={sounds} />
		</SequencerProvider>
	)
}
