import React, { useCallback, useEffect, useRef, useState } from 'react'
import { NOTE_LIST } from '@to-guitar'

export const useBoardTouch = (
	/**
	 * 点击音符值
	 */
	touched: string[],
	/**
	 * SetState音符值
	 */
	setTouched: SetState<string[]>,
	/**
	 * 手动设置Touch事件
	 */
	options?: {
		onClick?(): void
	}
) => {
	const isTouched = useRef(false)

	const onMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
		isTouched.current = true
		const targetData = (e.target as HTMLDivElement).dataset.key
		if (targetData && touched.indexOf(targetData) === -1) {
			setTouched([targetData])
		}
	}
	const onMouseOver = (e: React.MouseEvent | React.TouchEvent) => {
		const targetData = (e.target as HTMLDivElement).dataset.key
		if (targetData && isTouched.current && touched.indexOf(targetData) === -1) {
			setTouched([targetData])
		}
	}
	const onMouseUp = () => {
		isTouched.current = false
		options?.onClick?.()
		setTouched([])
	}
	const onMouseLeave = () => {
		isTouched.current = false
	}

	const handler = {
		// PC
		onMouseDown,
		onMouseOver,
		onMouseUp,
		onMouseLeave,
		// Mobile
		onTouchStart: onMouseDown,
		onTouchMove: onMouseOver,
		onTouchEnd: onMouseUp,
		// default
		onClick: onMouseOver,
	}
	return { handler, isTouched }
}

export const usePianoKeyDown = (touched: string[], setTouched: SetState<string[]>) => {
	const [part, setPart] = useState(false)
	const baseIndex = part ? 4 : 2 //默认是C2 => B4 共四个八度

	const getNode = useCallback(
		(key: number) => {
			const level = Math.floor(key / 12) + baseIndex
			const noteKey = NOTE_LIST[key % 12]
			return `${noteKey}${level}`
		},
		[baseIndex]
	)

	const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (PianoKeyConfig.has(e.code)) {
			const note = getNode(PianoKeyConfig.get(e.code)!)

			if (!touched.includes(note)) {
				touched.push(note)
				setTouched([...touched])
			}
		} else if (e.code.includes('Shift')) {
			setPart(!part)
		}
	}

	const onKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (PianoKeyConfig.has(e.code)) {
			const note = getNode(PianoKeyConfig.get(e.code)!)

			if (touched.includes(note)) {
				const index = touched.indexOf(note)
				touched.splice(index, 1)
				setTouched([...touched])
			}
		}
	}

	// useEffect(() => {
	// 	if (disable) {
	// 		return () => {
	// 			window.removeEventListener('keydown', onKeyDown)
	// 			window.removeEventListener('keyup', onKeyUp)
	// 		}
	// 	}
	// 	window.addEventListener('keydown', onKeyDown)
	// 	window.addEventListener('keyup', onKeyUp)

	// 	return () => {
	// 		window.removeEventListener('keydown', onKeyDown)
	// 		window.removeEventListener('keyup', onKeyUp)
	// 	}
	// }, [part, disable])
	const keyHandler = {
		onKeyDown,
		onKeyUp,
		tabIndex: 0,
	}

	return { part, keyHandler }
}

export const useGuitarKeyDown = (touched: string[], setTouched: SetState<string[]>) => {
	const [part, setPart] = useState(false)
	const baseIndex = part ? 48 : 0

	const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (GuitarKeyConfig.has(e.code)) {
			const index = GuitarKeyConfig.get(e.code)!
			const note = `${index + baseIndex}`

			if (!touched.includes(note)) {
				touched.push(note)
				setTouched([...touched])
			}
		} else if (e.code.includes('Shift')) {
			setPart(!part)
		}
	}

	const onKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (GuitarKeyConfig.has(e.code)) {
			const index = GuitarKeyConfig.get(e.code)!
			const note = `${index + baseIndex}`
			if (touched.includes(note)) {
				const index = touched.indexOf(note)
				touched.splice(index, 1)
				setTouched([...touched])
			}
		}
	}

	// useEffect(() => {
	// 	if (disable) {
	// 		return () => {
	// 			window.removeEventListener('keydown', onKeyDown)
	// 			window.removeEventListener('keyup', onKeyUp)
	// 		}
	// 	}

	// 	window.addEventListener('keydown', onKeyDown)
	// 	window.addEventListener('keyup', onKeyUp)

	// 	return () => {
	// 		window.removeEventListener('keydown', onKeyDown)
	// 		window.removeEventListener('keyup', onKeyUp)
	// 	}
	// }, [part, disable])

	const keyHandler = {
		onKeyDown,
		onKeyUp,
		tabIndex: 0,
	}

	return { part, keyHandler }
}

const PianoKeyConfig = new Map([
	['KeyZ', 0],
	['KeyS', 1],
	['KeyX', 2],
	['KeyD', 3],
	['KeyC', 4],
	['KeyV', 5],
	['KeyG', 6],
	['KeyB', 7],
	['KeyH', 8],
	['KeyN', 9],
	['KeyJ', 10],
	['KeyM', 11],

	['KeyY', 12],
	['Digit7', 13],
	['KeyU', 14],
	['Digit8', 15],
	['KeyI', 16],
	['KeyO', 17],
	['Digit0', 18],
	['KeyP', 19],
	['Minus', 20],
	['BracketLeft', 21],
	['Equal', 22],
	['BracketRight', 23],
])
const GuitarKeyConfig = new Map([
	['KeyZ', 0],
	['KeyX', 1],
	['KeyC', 2],
	['KeyV', 3],
	['KeyB', 4],
	['KeyN', 5],
	['KeyM', 6],
	['Comma', 7],
	['Period', 8],
	['Slash', 9],

	['KeyA', 16],
	['KeyS', 17],
	['KeyD', 18],
	['KeyF', 19],
	['KeyG', 20],
	['KeyH', 21],
	['KeyJ', 22],
	['KeyK', 23],
	['KeyL', 24],
	['Semicolon', 25],
	['Quote', 26],

	['KeyQ', 32],
	['KeyW', 33],
	['KeyE', 34],
	['KeyR', 35],
	['KeyT', 36],
	['KeyY', 37],
	['KeyU', 38],
	['KeyI', 39],
	['KeyO', 40],
	['KeyP', 41],
	['BracketLeft', 42],
	['BracketRight', 43],
	['BackSlash', 44],
])
