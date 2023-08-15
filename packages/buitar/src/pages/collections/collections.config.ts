import { Point, ChordType } from '@buitar/to-guitar'
import { InstrumentKeyboardKey } from '@/pages/settings/config/controller.type'

export const COLLECTIONS_KEY = 'collections_map'

export type CollectionChord = {
	taps: Point[]
	title?: string
	chordType?: ChordType
}

export type CollectionType = {
	title: string
	intro: string
	data: CollectionChord[]
}

export type CollectionMapType = Record<InstrumentKeyboardKey, CollectionType[]>
