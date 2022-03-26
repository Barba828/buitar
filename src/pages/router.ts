import { ChordAnalyzer } from './chord-analyzer'
import { ChordPlayer } from './chord-player'
import { ChordProgressions } from './chord-progressions'
import { HomePage } from './home'

export const routeConfig = [
	{
		name_zh: '首页',
		name_en: 'Home',
		path: '/',
		type: '',
		Component: HomePage,
	},
	{
		name_zh: '和弦库',
		name_en: 'Chord Library', //'Chord Player'
		path: '/library',
		type: 'menu',
		Component: ChordPlayer,
	},
	{
		name_zh: '和弦编辑',
		name_en: 'Chord Analyzer',
		path: '/analyzer',
		type: 'menu',
		Component: ChordAnalyzer,
	},
	{
		name_zh: '和弦进行',
		name_en: 'Chord Progressions',
		path: '/progressions',
		type: 'menu',
		Component: ChordProgressions,
	},
	// 'Chord Analyzer': true, // 和弦编辑
	// 'Chord Collection': true, // 收藏
]
