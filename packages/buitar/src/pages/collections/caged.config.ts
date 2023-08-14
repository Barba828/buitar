import { BoardPosition, Tone } from '@buitar/to-guitar'

export type CagedBaseType = Record<
	string,
	{
		tone: Tone
		tag: string
		tapPositions: (Partial<BoardPosition> & { baseGrade: number })[]
	}[]
>

export const GuitarCagedBaseConfig: CagedBaseType = {
	C: [
		{
			tone: 'C',
			tag: '',
			tapPositions: [
				{ baseGrade: 3, string: 2 },
				{ baseGrade: 2, string: 3 },
				{ baseGrade: 0, string: 4 },
				{ baseGrade: 1, string: 5 },
				{ baseGrade: 0, string: 6 },
			],
		},
		{
			tone: 'C',
			tag: '7',
			tapPositions: [
				{ baseGrade: 3, string: 2 },
				{ baseGrade: 2, string: 3 },
				{ baseGrade: 3, string: 4 },
				{ baseGrade: 1, string: 5 },
				{ baseGrade: 0, string: 6 },
			],
		},
		{
			tone: 'C',
			tag: 'maj7',
			tapPositions: [
				{ baseGrade: 3, string: 2 },
				{ baseGrade: 2, string: 3 },
				{ baseGrade: 0, string: 4 },
				{ baseGrade: 0, string: 5 },
				{ baseGrade: 0, string: 6 },
			],
		},
		{
			tone: 'C',
			tag: 'add9',
			tapPositions: [
				{ baseGrade: 3, string: 2 },
				{ baseGrade: 2, string: 3 },
				{ baseGrade: 0, string: 4 },
				{ baseGrade: 3, string: 5 },
				{ baseGrade: 0, string: 6 },
			],
		},
		{
			tone: 'C',
			tag: 'sus2',
			tapPositions: [
				{ baseGrade: 3, string: 2 },
				{ baseGrade: 0, string: 3 },
				{ baseGrade: 0, string: 4 },
				{ baseGrade: 1, string: 5 },
				{ baseGrade: 3, string: 6 },
			],
		},
	],
	A: [
		{
			tone: 'A',
			tag: '',
			tapPositions: [
				{ baseGrade: 0, string: 2 },
				{ baseGrade: 2, string: 3 },
				{ baseGrade: 2, string: 4 },
				{ baseGrade: 2, string: 5 },
				{ baseGrade: 0, string: 6 },
			],
		},
		{
			tone: 'A',
			tag: 'm',
			tapPositions: [
				{ baseGrade: 0, string: 2 },
				{ baseGrade: 2, string: 3 },
				{ baseGrade: 2, string: 4 },
				{ baseGrade: 1, string: 5 },
				{ baseGrade: 0, string: 6 },
			],
		},
		{
			tone: 'A',
			tag: '7',
			tapPositions: [
				{ baseGrade: 0, string: 2 },
				{ baseGrade: 2, string: 3 },
				{ baseGrade: 0, string: 4 },
				{ baseGrade: 2, string: 5 },
				{ baseGrade: 0, string: 6 },
			],
		},
		{
			tone: 'A',
			tag: 'maj7',
			tapPositions: [
				{ baseGrade: 0, string: 2 },
				{ baseGrade: 2, string: 3 },
				{ baseGrade: 1, string: 4 },
				{ baseGrade: 2, string: 5 },
				{ baseGrade: 0, string: 6 },
			],
		},
		{
			tone: 'A',
			tag: 'm7',
			tapPositions: [
				{ baseGrade: 0, string: 2 },
				{ baseGrade: 2, string: 3 },
				{ baseGrade: 0, string: 4 },
				{ baseGrade: 1, string: 5 },
				{ baseGrade: 0, string: 6 },
			],
		},
		{
			tone: 'A',
			tag: 'sus2',
			tapPositions: [
				{ baseGrade: 0, string: 2 },
				{ baseGrade: 2, string: 3 },
				{ baseGrade: 2, string: 4 },
				{ baseGrade: 0, string: 5 },
				{ baseGrade: 0, string: 6 },
			],
		},
		{
			tone: 'A',
			tag: 'sus4',
			tapPositions: [
				{ baseGrade: 0, string: 2 },
				{ baseGrade: 1, string: 3 },
				{ baseGrade: 1, string: 4 },
				{ baseGrade: 2, string: 5 },
				{ baseGrade: 0, string: 6 },
			],
		},
	],
	G: [
		{
			tone: 'G',
			tag: '',
			tapPositions: [
				{ baseGrade: 3, string: 1 },
				{ baseGrade: 2, string: 2 },
				{ baseGrade: 0, string: 3 },
				{ baseGrade: 0, string: 4 },
				{ baseGrade: 0, string: 5 },
				{ baseGrade: 3, string: 6 },
			],
		},
		{
			tone: 'G',
			tag: '7',
			tapPositions: [
				{ baseGrade: 3, string: 1 },
				{ baseGrade: 2, string: 2 },
				{ baseGrade: 0, string: 3 },
				{ baseGrade: 0, string: 4 },
				{ baseGrade: 0, string: 5 },
				{ baseGrade: 1, string: 6 },
			],
		},
		{
			tone: 'G',
			tag: 'maj7',
			tapPositions: [
				{ baseGrade: 3, string: 1 },
				{ baseGrade: 2, string: 2 },
				{ baseGrade: 0, string: 3 },
				{ baseGrade: 0, string: 4 },
				{ baseGrade: 0, string: 5 },
				{ baseGrade: 2, string: 6 },
			],
		},
		{
			tone: 'G',
			tag: 'add9',
			tapPositions: [
				{ baseGrade: 3, string: 1 },
				{ baseGrade: 0, string: 2 },
				{ baseGrade: 0, string: 3 },
				{ baseGrade: 2, string: 4 },
				{ baseGrade: 0, string: 5 },
				{ baseGrade: 3, string: 6 },
			],
		},
	],
	E: [
		{
			tone: 'E',
			tag: '',
			tapPositions: [
				{ baseGrade: 0, string: 1 },
				{ baseGrade: 2, string: 2 },
				{ baseGrade: 2, string: 3 },
				{ baseGrade: 1, string: 4 },
				{ baseGrade: 0, string: 5 },
				{ baseGrade: 0, string: 6 },
			],
		},
		{
			tone: 'E',
			tag: 'm',
			tapPositions: [
				{ baseGrade: 0, string: 1 },
				{ baseGrade: 2, string: 2 },
				{ baseGrade: 2, string: 3 },
				{ baseGrade: 0, string: 4 },
				{ baseGrade: 0, string: 5 },
				{ baseGrade: 0, string: 6 },
			],
		},
		{
			tone: 'E',
			tag: '7',
			tapPositions: [
				{ baseGrade: 0, string: 1 },
				{ baseGrade: 2, string: 2 },
				{ baseGrade: 0, string: 3 },
				{ baseGrade: 1, string: 4 },
				{ baseGrade: 0, string: 5 },
				{ baseGrade: 0, string: 6 },
			],
		},
		{
			tone: 'E',
			tag: 'maj7',
			tapPositions: [
				{ baseGrade: 0, string: 1 },
				{ baseGrade: 2, string: 2 },
				{ baseGrade: 1, string: 3 },
				{ baseGrade: 1, string: 4 },
				{ baseGrade: 0, string: 5 },
				{ baseGrade: 0, string: 6 },
			],
		},
		{
			tone: 'E',
			tag: 'm7',
			tapPositions: [
				{ baseGrade: 0, string: 1 },
				{ baseGrade: 2, string: 2 },
				{ baseGrade: 0, string: 3 },
				{ baseGrade: 0, string: 4 },
				{ baseGrade: 0, string: 5 },
				{ baseGrade: 0, string: 6 },
			],
		},
		{
			tone: 'E',
			tag: 'sus4',
			tapPositions: [
				{ baseGrade: 0, string: 1 },
				{ baseGrade: 2, string: 2 },
				{ baseGrade: 2, string: 3 },
				{ baseGrade: 2, string: 4 },
				{ baseGrade: 0, string: 5 },
				{ baseGrade: 0, string: 6 },
			],
		},
	],
	D: [
		{
			tone: 'D',
			tag: '',
			tapPositions: [
				{ baseGrade: 0, string: 3 },
				{ baseGrade: 2, string: 4 },
				{ baseGrade: 3, string: 5 },
				{ baseGrade: 2, string: 6 },
			],
		},
		{
			tone: 'D',
			tag: 'm',
			tapPositions: [
				{ baseGrade: 0, string: 3 },
				{ baseGrade: 2, string: 4 },
				{ baseGrade: 3, string: 5 },
				{ baseGrade: 1, string: 6 },
			],
		},
		{
			tone: 'D',
			tag: '7',
			tapPositions: [
				{ baseGrade: 0, string: 3 },
				{ baseGrade: 3, string: 4 },
				{ baseGrade: 2, string: 5 },
				{ baseGrade: 3, string: 6 },
			],
		},
		{
			tone: 'D',
			tag: 'maj7',
			tapPositions: [
				{ baseGrade: 0, string: 3 },
				{ baseGrade: 3, string: 4 },
				{ baseGrade: 3, string: 5 },
				{ baseGrade: 3, string: 6 },
			],
		},
		{
			tone: 'D',
			tag: 'm7',
			tapPositions: [
				{ baseGrade: 0, string: 3 },
				{ baseGrade: 2, string: 4 },
				{ baseGrade: 2, string: 5 },
				{ baseGrade: 1, string: 6 },
			],
		},
		{
			tone: 'D',
			tag: 'sus2',
			tapPositions: [
				{ baseGrade: 0, string: 3 },
				{ baseGrade: 2, string: 4 },
				{ baseGrade: 3, string: 5 },
				{ baseGrade: 0, string: 6 },
			],
		},
		{
			tone: 'D',
			tag: 'sus4',
			tapPositions: [
				{ baseGrade: 0, string: 3 },
				{ baseGrade: 2, string: 4 },
				{ baseGrade: 3, string: 5 },
				{ baseGrade: 3, string: 6 },
			],
		},
	],
}
