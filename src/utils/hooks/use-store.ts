import { useReducer } from 'react'

const storage = window.localStorage

export const useStore = <T>(key: string, defaultValue: T) => {
	// init value from store
	const init = () => {
		const value = storage.getItem(key)
		if (!value) {
			return reset()
		} else {
			return JSON.parse(value) as T
		}
	}
	// reset value to default
	const reset = () => {
		storage.setItem(key, JSON.stringify(defaultValue))
		return defaultValue
	}

	const reducer = (
		state: T,
		action: {
			type: 'set' | 'init' | 'reset'
			payload: T
		}
	) => {
		switch (action.type) {
			case 'set':
				let value = action.payload
				if (Array.isArray(state)) {
					value = new Object(action.payload) as T
				} else if (typeof state === 'object') {
					value = { ...state, ...action.payload }
				}
				storage.setItem(key, JSON.stringify(value))
				return value
			case 'init':
				return init()
			case 'reset':
				return reset()
			default:
				return action.payload
		}
	}

	const [state, dispatch] = useReducer(reducer, defaultValue, init)

	return [state, dispatch] as const
}
