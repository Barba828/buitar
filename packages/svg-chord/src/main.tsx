import React from 'react'
import ReactDOM from 'react-dom'
import SvgChord from '../lib/index.tsx'
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

ReactDOM.render(
	<React.StrictMode>
		<SvgChord points={mainCPoints} title='C' size={180}/>
		<SvgChord points={mainCPoints} title='C' size={80}/>
		<SvgChord points={mainCPoints} title='C' size={80} concise/>
	</React.StrictMode>,
	document.getElementById('app')
)
