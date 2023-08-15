import React, { useCallback, useEffect, useRef, useState } from 'react'
import { NOTE_LIST } from '@buitar/to-guitar'
import { useIsTouch } from '@/utils/hooks/use-device'

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
	const isTouchDevice = useIsTouch()

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

	const handler = isTouchDevice
		? {
				// Mobile
				onTouchStart: onMouseDown,
				// onTouchMove: onMouseOver, // Touch设置TouchMove事件响应页面滚动，暂不用于指板响应
				onTouchCancel: onMouseLeave,
				onTouchEnd: onMouseUp,
				// default
				onClick: onMouseOver,
		  }
		: {
				// PC
				onMouseDown,
				onMouseOver,
				onMouseUp,
				onMouseLeave,
				// default
				onClick: onMouseOver,
		  }
	return { handler, isTouched }
}

export const useBoardWheel = (element?: HTMLDivElement | null) => {
	useEffect(() => {
		if (!element) {
			return
		}

		const handleWheel = (e: WheelEvent) => {
			e.preventDefault()
			element.scrollLeft += e.deltaY
		}

		element.addEventListener('wheel', handleWheel, { passive: false })
		return element.removeEventListener('wheel', handleWheel)
	}, [element])
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

	const keyHandler = {
		onKeyDown,
		onKeyUp,
		tabIndex: 0,
	}

	return { part, keyHandler }
}

export const useGuitarKeyDown = (
	touched: string[],
	setTouched: SetState<string[]>,
	gradeLength: number = 17
) => {
	const [part, setPart] = useState(false)
	const baseIndex = part ? gradeLength * 3 : 0

	const getKeyboardNote = (code: string) => {
		if (GuitarKeyConfig.has(code)) {
			const [string, index] = GuitarKeyConfig.get(code)!
			return `${string * gradeLength + index + baseIndex}`
		}
	}

	const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		const note = getKeyboardNote(e.code)
		if (note && !touched.includes(note)) {
			touched.push(note)
			setTouched([...touched])
		} else if (e.code.includes('Shift')) {
			setPart(!part)
		}
	}

	const onKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
		const note = getKeyboardNote(e.code)
		if (note && touched.includes(note)) {
			const index = touched.indexOf(note)
			touched.splice(index, 1)
			setTouched([...touched])
		}
	}

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
	['KeyZ', [0, 0]],
	['KeyX', [0, 1]],
	['KeyC', [0, 2]],
	['KeyV', [0, 3]],
	['KeyB', [0, 4]],
	['KeyN', [0, 5]],
	['KeyM', [0, 6]],
	['Comma', [0, 7]],
	['Period', [0, 8]],
	['Slash', [0, 9]],

	['KeyA', [1, 0]],
	['KeyS', [1, 1]],
	['KeyD', [1, 2]],
	['KeyF', [1, 3]],
	['KeyG', [1, 4]],
	['KeyH', [1, 5]],
	['KeyJ', [1, 6]],
	['KeyK', [1, 7]],
	['KeyL', [1, 8]],
	['Semicolon', [1, 9]],
	['Quote', [1, 10]],

	['KeyQ', [2, 0]],
	['KeyW', [2, 1]],
	['KeyE', [2, 2]],
	['KeyR', [2, 3]],
	['KeyT', [2, 4]],
	['KeyY', [2, 5]],
	['KeyU', [2, 6]],
	['KeyI', [2, 7]],
	['KeyO', [2, 8]],
	['KeyP', [2, 9]],
	['BracketLeft', [2, 10]],
	['BracketRight', [2, 11]],
	['BackSlash', [2, 12]],
])
