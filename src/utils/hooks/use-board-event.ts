import { useEffect, useRef, useState } from 'react'

export const useBoardTouch = (touched: string[], setTouched: SetState<string[]>) => {
	const isTouched = useRef(false)

	const onMouseDown = (e: React.MouseEvent) => {
		isTouched.current = true
		const targetData = (e.target as HTMLDivElement).dataset.key
		if (targetData && touched.indexOf(targetData) === -1) {
			setTouched([targetData])
		}
	}
	const onMouseOver = (e: React.MouseEvent) => {
		const targetData = (e.target as HTMLDivElement).dataset.key
		if (targetData && isTouched.current && touched.indexOf(targetData) === -1) {
			setTouched([targetData])
		}
	}
	const onMouseUp = () => {
		isTouched.current = false
		setTouched([])
	}
	const onMouseLeave = () => {
		isTouched.current = false
	}

	const handler = {
		onMouseDown,
		onMouseOver,
		onMouseUp,
		onMouseLeave,
		onClick: onMouseOver,
	}

	return { handler, isTouched }
}

export const usePianoKeyDown = (
	touched: string[],
	setTouched: SetState<string[]>,
	disable?: boolean
) => {
	const [level, setLevel] = useState(3)

	const onKeyDown = (e: KeyboardEvent) => {
		const noteKey = PianoKeyConfig.get(e.code)
		const note = `${noteKey}${level}`

		if (PianoKeyConfig.has(e.code) && !touched.includes(note)) {
			touched.push(note)
			setTouched([...touched])
		} else {
			const tempLevel = Number(e.key)
			if (tempLevel && 1 < tempLevel && tempLevel < 6) {
				setLevel(tempLevel)
			}
		}
	}

	const onKeyUp = (e: KeyboardEvent) => {
		const noteKey = PianoKeyConfig.get(e.code)
		const note = `${noteKey}${level}`

		if (PianoKeyConfig.has(e.code) && touched.includes(note)) {
			const index = touched.indexOf(note)
			touched.splice(index, 1)
			setTouched([...touched])
		}
	}

	useEffect(() => {
		if (disable) {
			return () => {
				window.removeEventListener('keydown', onKeyDown)
				window.removeEventListener('keyup', onKeyUp)
			}
		}
		window.addEventListener('keydown', onKeyDown)
		window.addEventListener('keyup', onKeyUp)

		return () => {
			window.removeEventListener('keydown', onKeyDown)
			window.removeEventListener('keyup', onKeyUp)
		}
	}, [level, disable])

	return { level }
}

export const useGuitarKeyDown = (
	touched: string[],
	setTouched: SetState<string[]>,
	disable?: boolean
) => {
	const [part, setPart] = useState(false)
	const baseIndex = part ? 48 : 0

	const onKeyDown = (e: KeyboardEvent) => {
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

	const onKeyUp = (e: KeyboardEvent) => {
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

	useEffect(() => {
		if (disable) {
			return () => {
				window.removeEventListener('keydown', onKeyDown)
				window.removeEventListener('keyup', onKeyUp)
			}
		}
		window.addEventListener('keydown', onKeyDown)
		window.addEventListener('keyup', onKeyUp)

		return () => {
			window.removeEventListener('keydown', onKeyDown)
			window.removeEventListener('keyup', onKeyUp)
		}
	}, [part, disable])

	return { part }
}

const PianoKeyConfig = new Map([
	['KeyD', 'C'], //d
	['KeyR', 'C#'], //r
	['KeyF', 'D'], //f
	['KeyT', 'D#'], //t
	['KeyG', 'E'], //g
	['KeyH', 'F'], //h
	['KeyU', 'F#'], //u
	['KeyJ', 'G'], //j
	['KeyI', 'G#'], //i
	['KeyK', 'A'], //k
	['KeyO', 'A#'], //o
	['KeyL', 'B'], //l
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
