import React, { useCallback } from 'react'
import { BoardProvider, useBoardContext, usePagesIntro } from '@/components'
import { ChordList } from '@/components/chord-list'
import { ChordType, Point, Tone, transChord, transChordTaps } from '@buitar/to-guitar'

export type CollectionChord = {
	taps: Point[]
	title?: string
	chordType?: ChordType
}
export const COLLECTIONS_KEY = 'collections'
export type CollectionType = {
	title: string
	intro: string
	data: CollectionChord[]
}

export const Collections = () => {
	const intro = usePagesIntro()

	return (
		<BoardProvider>
			{intro}
			<DefaultCollection />
			<StorageCollection />
		</BoardProvider>
	)
}

const StorageCollection = () => {
	const { collection } = useBoardContext()

	return (
		<>
			{collection.map((item, index) => (
				<ChordList key={index} data={item.data} title={item.title} />
			))}
		</>
	)
}

/**
 * @todo 默认收藏改为svg识别格式，勿用算法实现
 * @returns 
 */
const DefaultCollection = () => {
	const LIST_1 = [
		{ tone: 'E', tag: '', index: 0 },
		{ tone: 'F', tag: '', index: 0 },
		{ tone: 'G', tag: '', index: 4 },
		{ tone: 'A', tag: '', index: 3 },
		{ tone: 'B', tag: '', index: 3 },
		{ tone: 'C', tag: '', index: 5 },
		{ tone: 'D', tag: '', index: 5 },
	]
	const LIST_2 = [
		{ tone: 'A', tag: 'm', index: 0 },
		{ tone: 'B', tag: 'm', index: 0 },
		{ tone: 'C', tag: 'm', index: 1 },
		{ tone: 'D', tag: 'm', index: 1 },
		{ tone: 'E', tag: 'm', index: 10 },
		{ tone: 'F', tag: 'm', index: 5 },
		{ tone: 'G', tag: 'm', index: 6 },
	]
	const getChordListDatas = useCallback((list: any[]) => {
		return list.map((item) => {
			const chord = transChord(item.tone as Tone, item.tag)!
			const title = item.tone + item.tag
			const taps = transChordTaps(chord.chord)[item.index].chordTaps

			return {
				title,
				taps,
			}
		})
	}, [])
	const data_1 = getChordListDatas(LIST_1)
	const data_2 = getChordListDatas(LIST_2)
	return (
		<>
			<ChordList data={data_1} title="Fingering1" disableCollect />
			<ChordList data={data_2} title="Fingering2" disableCollect />
		</>
	)
}
