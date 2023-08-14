import { Point, ChordType } from "@buitar/to-guitar"

export const COLLECTIONS_KEY = 'collections'

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
