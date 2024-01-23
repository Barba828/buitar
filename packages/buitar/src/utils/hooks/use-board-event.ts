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
	options: {
		onClick?(): void
		onChange?(item: string): void
	} = {}
) => {
	const { onClick, onChange } = options
	const [active, setActive] = useState<string>('')
	const isTouched = useRef(false)
	const isTouchDevice = useIsTouch()

	/**从touched音符中移除active音符 */
	const removeActiveFromTouched = () => {
		const index = touched.indexOf(active)
		touched.splice(index, 1)
		setTouched([...touched])
		setActive('')
		onChange?.('')
	}

	const onMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
		isTouched.current = true
		const targetData = (e.target as HTMLDivElement).dataset.key
		if (targetData) {
			onChange?.(targetData)
			setActive(targetData)
			// 更新Touched
			if (touched.indexOf(targetData) === -1) {
				setTouched([...touched, targetData])
			}
		}
	}
	const onMouseOver = (e: React.MouseEvent | React.TouchEvent) => {
		const targetData = (e.target as HTMLDivElement).dataset.key
		if (targetData && isTouched.current) {
			removeActiveFromTouched() // Touched中移除原active
			setActive(targetData)
			onChange?.(targetData)
			// 更新Touched
			if (touched.indexOf(targetData) === -1) {
				setTouched([...touched, targetData])
			}
		}
	}
	const onMouseUp = () => {
		removeActiveFromTouched()
		isTouched.current = false
		onClick?.()
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
	return {
		/**监听事件 */
		handler,
		/**当前活跃Key */
		active,
		/**当前是否Touch */
		isTouched,
	}
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
		return () => element.removeEventListener('wheel', handleWheel)
	}, [element])
}

export const useGuitarKeyDown = (
	touched: string[],
	setTouched: SetState<string[]>,
	options: {
		gradeLength?: number
		onChange?(item: string): void
	} = {}
) => {
	const { gradeLength = 17, onChange } = options
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
		if (note) {
			if (!touched.includes(note)) {
				onChange?.(note)
				setTouched([...touched, note])
			}
		} else if (e.code.includes('Shift')) {
			setPart(!part)
		}
	}

	const onKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
		const note = getKeyboardNote(e.code)

		if (note) {
			const index = touched.indexOf(note)
			if (touched.includes(note)) {
				onChange?.('')
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

export const usePianoKeyDown = (
	touched: string[],
	setTouched: SetState<string[]>,
	options: {
		onChange?(item: string): void
	} = {}
) => {
	const { onChange } = options
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
				onChange?.(note)
				setTouched([...touched, note])
			}
		} else if (e.code.includes('Shift')) {
			setPart(!part)
		}
	}

	const onKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (PianoKeyConfig.has(e.code)) {
			const note = getNode(PianoKeyConfig.get(e.code)!)
			if (touched.includes(note)) {
				onChange?.('')
				const index = touched.indexOf(note)
				touched.splice(index, 1)
				setTouched([...touched])
			}
		}
	}

	const keyHandler = {
		onKeyPress: onKeyDown,
		onKeyUp,
		tabIndex: 0,
	}

	return { part, keyHandler }
}

export const useDrumKeyDown = (
	touched: string[],
	setTouched: SetState<string[]>,
	touchList: string[],
	options: {
		onChange?(item: string): void
	} = {}
) => {
	const { onChange } = options

	const getKeyboardKey = (code: string) => {
		if (GuitarKeyConfig.has(code)) {
			return touchList[DrumKeyConfig.get(code)!]
		}
	}

	const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		const key = getKeyboardKey(e.code)
		if (key && !touched.includes(key)) {
			onChange?.(key)
			setTouched([...touched, key])
		}
	}

	const onKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
		const key = getKeyboardKey(e.code)
		onChange?.('')

		if (key && touched.includes(key)) {
			const index = touched.indexOf(key)
			touched.splice(index, 1)
			setTouched([...touched])
		}
	}

	const keyHandler = {
		onKeyDown,
		onKeyUp,
		tabIndex: 0,
	}

	return { keyHandler }
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
const DrumKeyConfig = new Map([
	['KeyQ', 0],
	['KeyW', 1],
	['KeyE', 2],
	['KeyR', 3],
	['KeyT', 4],
	['KeyY', 5],

	['KeyA', 6],
	['KeyS', 7],
	['KeyD', 8],
	['KeyF', 9],
	['KeyG', 10],
	['KeyH', 11],

	['KeyZ', 12],
	['KeyX', 13],
	['KeyC', 14],
	['KeyV', 15],
	['KeyB', 16],
	['KeyN', 17],
])
