import React from 'react'
import ReactDOM from 'react-dom'
import { SvgChord, SvgTablature } from '../lib'
import './style.css'

const mainCPoints = [
	{
		string: 1,
		fret: -1,
	},
	{
		string: 2,
		fret: 3,
		tone: 'C',
	},
	{
		string: 3,
		fret: 2,
		tone: 'E',
	},
	{
		string: 4,
		fret: 0,
		tone: 'G',
	},
	{
		string: 5,
		fret: 1,
		tone: 'C',
	},
	{
		string: 6,
		fret: 0,
		tone: 'E',
	},
]

const AMinorFifthPoints = [
	{
		string: 1,
		fret: 3,
		tone: '5',
	},
	{
		string: 1,
		fret: 5,
		tone: '6',
	},
	{
		string: 2,
		fret: 3,
		tone: '1',
	},
	{
		string: 2,
		fret: 5,
		tone: '2',
	},
	{
		string: 3,
		fret: 2,
		tone: '3',
	},
	{
		string: 3,
		fret: 5,
		tone: '5',
	},
	{
		string: 4,
		fret: 2,
		tone: '6',
	},
	{
		string: 4,
		fret: 5,
		tone: '1',
	},
	{
		string: 5,
		fret: 3,
		tone: '2',
	},
	{
		string: 5,
		fret: 5,
		tone: '3',
	},
	{
		string: 6,
		fret: 3,
		tone: '5',
	},
	{
		string: 6,
		fret: 5,
		tone: '6',
	},
	{
		string: 1,
		fret: 8,
		tone: '1',
	},
	{
		string: 2,
		fret: 7,
		tone: '3',
	},
	{
		string: 3,
		fret: 7,
		tone: '6',
	},
	{
		string: 4,
		fret: 7,
		tone: '2',
	},
	{
		string: 5,
		fret: 8,
		tone: '5',
	},
	{
		string: 6,
		fret: 8,
		tone: '6',
	},
	{
		string: 1,
		fret: 10,
		tone: '2',
	},
	{
		string: 2,
		fret: 10,
		tone: '5',
	},
	{
		string: 3,
		fret: 10,
		tone: '1',
	},
	{
		string: 4,
		fret: 9,
		tone: '3',
	},
	{
		string: 5,
		fret: 19,
		tone: '6',
	},
	{
		string: 6,
		fret: 10,
		tone: '2',
	},
]

ReactDOM.render(
	<React.StrictMode>
		<h1>Svg Chord</h1>
		<div style={{ display: 'flex' }}>
			<SvgChord points={mainCPoints} title="C" size={120} />
			<SvgChord points={mainCPoints} title="C" size={80} />
			<SvgChord points={mainCPoints} title="C" size={80} concise />
		</div>
		<h1>Svg Tablature</h1>
		<div style={{ display: 'flex' }}>
			<SvgTablature points={AMinorFifthPoints} title="A Minor Fifth" size={120} range={[0, 10]} />
			<SvgTablature points={AMinorFifthPoints} title="A Minor Fifth" size={80} range={[0, 12]} horizontal={true} />
			<SvgTablature points={mainCPoints} title="C" size={80} />
			<SvgTablature points={mainCPoints} title="C" size={80} horizontal={true} />
		</div>
	</React.StrictMode>,
	document.getElementById('app')
)
