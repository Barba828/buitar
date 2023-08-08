import { HomePage } from './home'
import { ChordAnalyzer } from './chord-analyzer'
import { ChordPlayer } from './chord-player'
import { GuitarTableture } from './guitar-tableture'
import { ChordProgressions } from './chord-progressions'
import { Collections } from './collections'
import { InstrumentPlayer } from './instrument-player'
import { SequencerPlayer } from './sequencer-player'

import { PlayToolsHome } from './play-tools'
import { FifthCircleTool } from './play-tools/panels/fifth-circle-tool'
import { Metronome } from './play-tools/panels/metronome-tool'

import { SettingsPage } from './settings'

export const baseUrl = import.meta.env.BASE_URL || '/buitar/'

export type RouteType = {
	name: string
	name_en?: string
	path: string
	type?: '' | 'menu' | 'children'
	Component: any
	children?: RouteType[]
}

export const routeMap: Record<string, RouteType> = {
	home: {
		name: '首页',
		name_en: 'Home',
		path: baseUrl,
		type: '',
		Component: HomePage,
	},
	chordLib: {
		name: '和弦库',
		name_en: 'Chord Library',
		path: `${baseUrl}library`,
		type: 'menu',
		Component: ChordPlayer,
	},
	chordAnalyzer: {
		name: '和弦编辑',
		name_en: 'Chord Analyzer',
		path: `${baseUrl}analyzer`,
		type: 'menu',
		Component: ChordAnalyzer,
	},
	guitarTableture: {
		name: '吉他指型',
		name_en: 'Guitar Tableture',
		path: `${baseUrl}tableture`,
		type: 'menu',
		Component: GuitarTableture,
	},
	progressions: {
		name: '和弦进行',
		name_en: 'Chord Progressions',
		path: `${baseUrl}progressions`,
		type: 'menu',
		Component: ChordProgressions,
	},
	collections: {
		name: '和弦收藏',
		name_en: 'Chord Collections',
		path: `${baseUrl}collections`,
		type: 'menu',
		Component: Collections,
	},
	tools: {
		name: '工具',
		name_en: 'Play Tools',
		path: `${baseUrl}tools`,
		type: 'menu',
		Component: PlayToolsHome,
		children: [
			{
				name: '五度圈',
				path: `fifth`,
				Component: FifthCircleTool,
			},
			{
				name: '节拍器',
				path: `metronome`,
				Component: Metronome,
			},
		],
	},
	instrument: {
		name: '乐器',
		name_en: 'Instrument',
		path: `${baseUrl}instrument`,
		type: 'menu',
		Component: InstrumentPlayer,
	},
	creation: {
		name: '创造',
		name_en: 'Creation',
		path: `${baseUrl}creation`,
		type: 'menu',
		Component: SequencerPlayer,
	},
	settings: {
		name: '设置',
		name_en: 'Settings',
		path: `${baseUrl}settings`,
		type: 'menu',
		Component: SettingsPage,
	},
}

export const routeConfig = Object.values(routeMap)
