import { TouchEventHandler, TouchEvent, useRef, useEffect } from 'react'

export const useTouchMove = ({
	handleTouchMove,
	handleTouchEnd,
}: {
	handleTouchMove?: (deltaX: number, deltaY: number) => void
	handleTouchEnd?: (deltaX: number, deltaY: number) => void
}) => {
	const touchRef = useRef<HTMLElement | null>(null)
	const startX = useRef(0)
	const startY = useRef(0)
	const deltaX = useRef(0)
	const deltaY = useRef(0)

	const onTouchStart: TouchEventHandler = (event: TouchEvent) => {
		const touch = event.touches[0]
		startX.current = touch.clientX
		startY.current = touch.clientY
	}

	const onTouchMove: TouchEventHandler<HTMLElement> = (event) => {
		event.preventDefault()
		const touch = event.touches[0]
		deltaX.current = touch.clientX - startX.current
		deltaY.current = touch.clientY - startY.current
		handleTouchMove?.(deltaX.current, deltaY.current)
	}

	const onTouchEnd: TouchEventHandler<HTMLElement> = () => {
		handleTouchEnd?.(deltaX.current, deltaY.current)
		deltaX.current = 0
		deltaY.current = 0
	}

	useEffect(() => {
		if (!touchRef.current) {
			return
		}

		touchRef.current.addEventListener('touchstart', onTouchStart as any, { passive: false })
		touchRef.current.addEventListener('touchmove', onTouchMove as any, { passive: false })
		touchRef.current.addEventListener('touchend', onTouchEnd as any, { passive: false })
		return () => {
            if (!touchRef.current) {
                return
            }
            touchRef.current.removeEventListener('touchstart', onTouchStart as any)
            touchRef.current.removeEventListener('touchmove', onTouchMove as any)
            touchRef.current.removeEventListener('touchend', onTouchEnd as any)
        }
	}, [touchRef.current, handleTouchMove, handleTouchEnd])

	return {
		touchRef,
		deltaX,
		deltaY,
		handler: {
			onTouchStart,
			onTouchMove,
			onTouchEnd,
		},
	}
}
