import { type RouteObject } from 'react-router-dom'

import { HomePage } from './home'
import { ChordAnalyzer } from './chord-analyzer'
import { ChordPlayer } from './chord-player'
import {
	GuitarBoardFingeringList,
	GuitarFingering,
	TapedGuitarBoardFingering,
} from './guitar-fingering'
import { ChordProgressions } from './chord-progressions'
import { Collections, CagedCollection, StorageCollection } from './collections'
import { InstrumentPlayer } from './instrument-player'
import { SequencerPlayer } from './sequencer-player'
import { AbcEditor } from './abc-editor'

import { PlayToolsHome } from './play-tools'
import { FifthCircleTool } from './play-tools/panels/fifth-circle-tool'
import { Metronome } from './play-tools/panels/metronome-tool'
import { IntervalList } from './play-tools/panels/interval-list-tool'

import { SettingsPage } from './settings'
import { NotFound } from './not-found'

export const baseUrl = import.meta.env.BASE_URL || '/buitar/'

type RouteMeta = {
	menu?: boolean
	tabMenu?: boolean
	icon?: string
} & Record<string, any>

export type RouteType = {
	name: string
	id: string
	path: string
	children?: RouteType[]
	meta?: RouteMeta
	element?: RouteObject['element']
	Component?: RouteObject['Component']
}

export const routeConfig: Array<RouteType> = [
	{
		name: '首页',
		id: 'Home',
		path: baseUrl,
		Component: HomePage,
		meta: { tabMenu: true, icon: 'icon-buitar' },
	},
	{
		name: '和弦库',
		id: 'ChordLibrary',
		path: `${baseUrl}library`,
		meta: { menu: true, tabMenu: true, icon: 'icon-chord' },
		Component: ChordPlayer,
	},
	{
		name: '和弦编辑',
		id: 'ChordAnalyzer',
		path: `${baseUrl}analyzer`,
		meta: { menu: true, icon: 'icon-edit-score' },
		Component: ChordAnalyzer,
	},
	{
		name: '吉他指型',
		id: 'GuitarFingering',
		path: `${baseUrl}fingering`,
		meta: { menu: true, tabMenu: true, icon: 'icon-gesture-hand-fill' },
		Component: GuitarFingering,
		children: [
			{
				name: '',
				id: 'GuitarFingeringSingleHome',
				path: `${baseUrl}fingering`,
				Component: TapedGuitarBoardFingering,
			},
			{
				name: '指板分析',
				id: 'GuitarFingeringSingle',
				path: `${baseUrl}fingering/single`,
				Component: TapedGuitarBoardFingering,
				meta: {},
			},
			{
				name: '固定区域指型', // 多指型
				id: 'GuitarFingeringMulti',
				path: `${baseUrl}fingering/multi`,
				Component: GuitarBoardFingeringList,
			},
		],
	},
	{
		name: '和弦进行',
		id: 'ChordProgressions',
		path: `${baseUrl}progressions`,
		meta: { menu: true, tabMenu: true, icon: 'icon-changyonghexian' },
		Component: ChordProgressions,
	},
	{
		name: '和弦收藏',
		id: 'ChordCollections',
		path: `${baseUrl}collections`,
		meta: { menu: true, icon: 'icon-dir' },
		Component: Collections,
		children: [
			{
				name: 'Caged系统',
				id: 'ChordCollectionsCaged',
				path: `${baseUrl}collections/caged`,
				Component: CagedCollection,
				meta: {
					back: true,
				},
			},
			{
				name: '我的收藏',
				id: 'ChordCollectionsOfMine',
				path: `${baseUrl}collections`,
				Component: StorageCollection,
			},
		],
	},
	{
		name: '工具',
		id: 'PlayTools',
		path: `${baseUrl}tools`,
		meta: { menu: true, icon: 'icon-hexiantu' },
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
			{
				name: '音程关系',
				id: 'PlayToolsIntervalList',
				path: `${baseUrl}tools/interval-list`,
				Component: IntervalList,
				meta: {
					back: true,
				},
			},
		],
	},
	{
		name: '乐器',
		id: 'Instrument',
		path: `${baseUrl}instrument`,
		meta: { menu: true, icon: 'icon-play-piano' },
		Component: InstrumentPlayer,
	},
	{
		name: '音序机',
		id: 'Creation',
		path: `${baseUrl}creation`,
		meta: { menu: true, icon: 'icon-musical-note' },
		Component: SequencerPlayer,
	},
	{
		name: '乐谱编辑',
		id: 'ABCEditor',
		path: `${baseUrl}abc-editor`,
		meta: { menu: true, icon: 'icon-hexianzidian' },
		Component: AbcEditor,
	},
	{
		name: '设置',
		id: 'Settings',
		path: `${baseUrl}settings`,
		meta: { menu: true, tabMenu: true, icon: 'icon-setting' },
		Component: SettingsPage,
	},
	{
		name: 'test',
		id: 'Test',
		path: `${baseUrl}test`,
	},
	{
		name: '404',
		id: 'NotFound',
		path: `${baseUrl}*`,
		Component: NotFound,
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
