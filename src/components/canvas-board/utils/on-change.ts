const FRAME_TIMER = 16

export const debounce = <T>(fn: (args?: T) => any, wait: number = FRAME_TIMER) => {
	let timer: ReturnType<typeof setTimeout>
	return (args?: T) => {
		clearTimeout(timer)
		timer = setTimeout(() => fn(args), wait)
	}
}

export const OnChange = <T>(target: T, callback: (target: T) => void) => {
	const debounceCallback = debounce(() => {
		callback(target)
	})
	return new Proxy(target as any, {
		set(target, property, value) {
			target[property] = value
			debounceCallback()
			return true
		},
	}) as T
}
