import { HomePage } from './home'
import { ChordAnalyzer } from './chord-analyzer'
import { ChordPlayer } from './chord-player'
import { GuitarTableture } from './guitar-tableture'
import { ChordProgressions } from './chord-progressions'
import { Collections } from './collections'
import { InstrumentPlayer } from './instrument-player'
import { SequencerPlayer } from './sequencer-player'

export const routeMap = {
	home: {
		name_zh: '首页',
		name_en: 'Home',
		path: '/Buitar/',
		type: '',
		Component: HomePage,
	},
	chordLib: {
		name_zh: '和弦库',
		name_en: 'Chord Library',
		path: '/Buitar/library',
		type: 'menu',
		Component: ChordPlayer,
	},
	chordAnalyzer: {
		name_zh: '和弦编辑',
		name_en: 'Chord Analyzer',
		path: '/Buitar/analyzer',
		type: 'menu',
		Component: ChordAnalyzer,
	},
	guitarTableture: {
		name_zh: '吉他指型',
		name_en: 'Guitar Tableture',
		path: '/Buitar/tableture',
		type: 'menu',
		Component: GuitarTableture,
	},
	progressions: {
		name_zh: '和弦进行',
		name_en: 'Chord Progressions',
		path: '/Buitar/progressions',
		type: 'menu',
		Component: ChordProgressions,
	},
	collections: {
		name_zh: '和弦收藏',
		name_en: 'Chord Collections',
		path: '/Buitar/collections',
		type: 'menu',
		Component: Collections,
	},
	instrument: {
		name_zh: '乐器',
		name_en: 'Instrument',
		path: '/Buitar/instrument',
		type: 'menu',
		Component: InstrumentPlayer,
	},
	creation: {
		name_zh: '创造',
		name_en: 'Creation',
		path: '/Buitar/creation',
		type: 'menu',
		Component: SequencerPlayer,
	},
}

export const routeConfig = Object.values(routeMap)
