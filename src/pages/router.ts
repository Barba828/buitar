import { ChordAnalyzer } from './chord-analyzer'
import { ChordPlayer } from './chord-player'
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
	// 'Chord Analyzer': true, // 和弦编辑
	// 'Chord Progressions': true, // 和弦进行
	// 'Chord Collection': true, // 收藏
]
