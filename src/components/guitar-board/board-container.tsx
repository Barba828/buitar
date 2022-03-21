import React, { useMemo, useState } from 'react'
import {
	BoardController,
	ChordController,
	ChordTapsController,
	GuitarBoard,
	ChordCard,
} from './index'
import { BoardProvider } from './board-provider'
import { FifthsCircle } from '../fifths-circle'
import { OnChange } from '../canvas-board/utils/on-change'

export const BoardContainer = () => {
	// const [te, SetTe] = useState<any>({ name: '123' })
	// const test = useMemo(() => {
	// 	return new Test(SetTe)
	// }, [SetTe])
	// if (!te) return null
	return (
		<BoardProvider>
			<ChordController />
			<ChordTapsController />
			<GuitarBoard />
			{/* <div>{te.name}</div>
			<button
				onClick={() => {
					console.log(te)

					test.setHistory('name', te.name === 'test' ? 'ok' : 'test')
				}}
			>
				aaa
			</button> */}
			<BoardController />
			<ChordCard />
			<FifthsCircle />
		</BoardProvider>
	)
}

// class Test {
// 	readonly _history: { [key in string]: any } = OnChange({ name: '222' } as any, () => {
// 		this.draw()
// 		this.setTe({ ...this._history })
// 	})

// 	constructor(private setTe: (te: any) => void) {
// 		// this.setHistory('name', 'init')
// 	}

// 	get history() {
// 		return this._history
// 	}
// 	setHistory(key: string, value: any) {
// 		this._history[key] = value
// 	}

// 	draw() {
// 		console.log('666')
// 	}
// }
