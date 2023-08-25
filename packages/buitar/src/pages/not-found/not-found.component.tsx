import {
	Sequencer,
	SequencerController,
	SequencerProvider,
	Sound,
	useBoardContext,
} from '@/components'
import { FC } from 'react'
import { Link } from 'react-router-dom'
import { baseUrl } from '../router'

export const NotFound: FC = () => {
	const { player } = useBoardContext()
	const sounds = [
		{
			key: 'C4',
			blocks: [
				[3, 3],
				[8, 8],
				[7, 7],
				[14, 14],
			],
		},
		{
			key: 'B3',
			blocks: [
				[2, 2],
				[3, 3],
				[6, 6],
				[13, 13],
				[14, 14],
				[9, 9],
			],
		},
		{
			key: 'A3',
			blocks: [
				[1, 1],
				[3, 3],
				[6, 6],
				[12, 12],
				[14, 14],
				[9, 9],
			],
		},
		{
			key: 'G3',
			blocks: [
				[0, 0],
				[3, 3],
				[6, 6],
				[11, 11],
				[14, 14],
				[9, 9],
			],
		},
		{
			key: 'F3',
			blocks: [
				[0, 0],
				[3, 3],
				[6, 6],
				[11, 11],
				[14, 14],
				[9, 9],
			],
		},
		{
			key: 'E3',
			blocks: [
				[0, 0],
				[1, 1],
				[2, 2],
				[3, 3],
				[4, 4],
				[6, 6],
				[11, 11],
				[12, 12],
				[13, 13],
				[15, 15],
				[9, 9],
				[14, 14],
			],
		},
		{
			key: 'D3',
			blocks: [
				[3, 3],
				[6, 6],
				[14, 14],
				[9, 9],
			],
		},
		{
			key: 'C3',
			blocks: [
				[3, 3],
				[8, 8],
				[7, 7],
				[14, 14],
			],
		},
	] as Sound[]

	return (
		<SequencerProvider defaultEditable={false}>
			<SequencerController mVisible={false}></SequencerController>
			<Sequencer player={player} sounds={sounds} />
			<Link to={baseUrl}>
				<div className="primary-button flex-center" style={{ padding: 10, width: 200 }}>
					返回首页 〉
				</div>
			</Link>
		</SequencerProvider>
	)
}
