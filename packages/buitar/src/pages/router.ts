import { RouteObject } from 'react-router-dom'

import { HomePage } from './home'
import { ChordAnalyzer } from './chord-analyzer'
import { ChordPlayer } from './chord-player'
import {
	GuitarBoardTabletureList,
	GuitarTableture,
	TapedGuitarBoardTableture,
} from './guitar-tableture'
import { ChordProgressions } from './chord-progressions'
import { Collections, CagedCollection, StorageCollection } from './collections'
import { InstrumentPlayer } from './instrument-player'
import { SequencerPlayer } from './sequencer-player'

import { PlayToolsHome } from './play-tools'
import { FifthCircleTool } from './play-tools/panels/fifth-circle-tool'
import { Metronome } from './play-tools/panels/metronome-tool'

import { SettingsPage } from './settings'

export const baseUrl = import.meta.env.BASE_URL || '/buitar/'

export type RouteType = {
	name: string
	id: string
	path: string
	type?: '' | 'menu' | 'children'
	children?: RouteType[]
	meta?: Record<string, any>
	element?: RouteObject['element']
	Component?: RouteObject['Component']
}

export const routeConfig: Array<RouteType> = [
	{
		name: '首页',
		id: 'Home',
		path: baseUrl,
		type: '',
		Component: HomePage,
	},
	{
		name: '和弦库',
		id: 'ChordLibrary',
		path: `${baseUrl}library`,
		type: 'menu',
		Component: ChordPlayer,
	},
	{
		name: '和弦编辑',
		id: 'ChordAnalyzer',
		path: `${baseUrl}analyzer`,
		type: 'menu',
		Component: ChordAnalyzer,
	},
	{
		name: '吉他指型',
		id: 'GuitarTableture',
		path: `${baseUrl}tableture`,
		type: 'menu',
		Component: GuitarTableture,
		children: [
			{
				name: '',
				id: 'GuitarTabletureSingleHome',
				path: `${baseUrl}tableture`,
				Component: TapedGuitarBoardTableture,
			},
			{
				name: '指板分析',
				id: 'GuitarTabletureSingle',
				path: `${baseUrl}tableture/single`,
				Component: TapedGuitarBoardTableture,
				meta: {},
			},
			{
				name: '固定区域指型', // 多指型
				id: 'GuitarTabletureMulti',
				path: `${baseUrl}tableture/multi`,
				Component: GuitarBoardTabletureList,
			},
		],
	},
	{
		name: '和弦进行',
		id: 'ChordProgressions',
		path: `${baseUrl}progressions`,
		type: 'menu',
		Component: ChordProgressions,
	},
	{
		name: '和弦卡片',
		id: 'ChordCollections',
		path: `${baseUrl}collections`,
		type: 'menu',
		Component: Collections,
		children: [
			{
				name: 'Caged系统',
				id: 'ChordCollectionsCaged',
				path: `${baseUrl}collections`,
				Component: CagedCollection,
			},
			{
				name: '我的收藏',
				id: 'ChordCollectionsOfMine',
				path: `${baseUrl}collections/mine`,
				Component: StorageCollection,
				meta: {
					back: true,
				},
			},
		],
	},
	{
		name: '工具',
		id: 'PlayTools',
		path: `${baseUrl}tools`,
		type: 'menu',
		Component: PlayToolsHome,
		children: [
			{
				name: '五度圈',
				id: 'PlayToolsFifth',
				path: `${baseUrl}tools/fifth`,
				Component: FifthCircleTool,
				meta: {
					back: true,
				},
			},
			{
				name: '节拍器',
				id: 'PlayToolsMetronome',
				path: `${baseUrl}tools/metronome`,
				Component: Metronome,
				meta: {
					back: true,
				},
			},
			// {
			// 	name: '和弦图生成',
			// 	id: 'PlayToolsSvgSave',
			// 	path: `${baseUrl}tools/svg-save`,
			// 	Component: Metronome,
			// 	meta: {
			// 		back: true,
			// 	},
			// },
		],
	},
	{
		name: '乐器',
		id: 'Instrument',
		path: `${baseUrl}instrument`,
		type: 'menu',
		Component: InstrumentPlayer,
	},
	{
		name: '创造',
		id: 'Creation',
		path: `${baseUrl}creation`,
		type: 'menu',
		Component: SequencerPlayer,
	},
	{
		name: '设置',
		id: 'Settings',
		path: `${baseUrl}settings`,
		type: 'menu',
		Component: SettingsPage,
	},
]

const flattenRoutes = (routes: Array<RouteType>) => {
	let result = new Array<RouteType>()

	for (let i = 0; i < routes.length; i++) {
		result.push(routes[i])

		if (routes[i].children) {
			result = result.concat(flattenRoutes(routes[i].children!))
		}
	}
	return result
}

export const flatRouteConfig: Array<RouteType> = flattenRoutes(routeConfig)
