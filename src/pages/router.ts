import { HomePage } from './home'
import { ChordAnalyzer } from './chord-analyzer'
import { ChordPlayer } from './chord-player'
import { ChordProgressions } from './chord-progressions'
import { Collections } from './collections'
import { InstrumentPlayer } from './instrument-player'
import { SequencerPlayer } from './sequencer-player'

export const routeConfig = [
	{
		name_zh: '首页',
		name_en: 'Home',
		path: '/Buitar/',
		type: '',
		Component: HomePage,
	},
	{
		name_zh: '和弦库',
		name_en: 'Chord Library', //'Chord Player'
		path: '/Buitar/library',
		type: 'menu',
		Component: ChordPlayer,
	},
	{
		name_zh: '和弦编辑',
		name_en: 'Chord Analyzer',
		path: '/Buitar/analyzer',
		type: 'menu',
		Component: ChordAnalyzer,
	},
	{
		name_zh: '和弦进行',
		name_en: 'Chord Progressions',
		path: '/Buitar/progressions',
		type: 'menu',
		Component: ChordProgressions,
	},
	{
		name_zh: '和弦收藏',
		name_en: 'Chord Collection',
		path: '/Buitar/collection',
		type: 'menu',
		Component: Collections,
	},
	{
		name_zh: '乐器',
		name_en: 'Instrument',
		path: '/Buitar/instrument',
		type: 'menu',
		Component: InstrumentPlayer,
	},
	{
		name_zh: '创造',
		name_en: 'Creation',
		path: '/Buitar/creation',
		type: 'menu',
		Component: SequencerPlayer,
	},
	// 'Chord Analyzer': true, // 和弦编辑
	// 'Chord Collection': true, // 收藏
]
