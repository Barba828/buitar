import React, { useCallback, useRef, useState } from 'react'
import cx from 'classnames'

import styles from './range-input.module.scss'

export type RangeInputProps = {
	range?: [number, number]
	defaultValue?: [number, number]
	onChange?(range: [number, number]): void
	backgoundColor?: string
	highLightColor?: string
	className?: string
	inputClassName?: string
}

/**
 * 带左右范围的range input选择器
 * @param param0
 * @returns
 */
export const RangeInput = ({
	range: [min, max] = [0, 100],
	defaultValue: [defaultStart, defaultEnd] = [max * 0.3, max * 0.6],
	onChange,
	backgoundColor = '#eee4',
	highLightColor = '#ccc',
	className,
	inputClassName,
}: RangeInputProps) => {
	const [start, setStart] = useState(defaultStart)
	const [end, setEnd] = useState(defaultEnd)
	const refStart = useRef<HTMLInputElement>(null)
	const refEnd = useRef<HTMLInputElement>(null)

	const setRange = useCallback(() => {
		const [startValue, endValue] = [
			Number(refStart.current?.value || 0),
			Number(refEnd.current?.value || 0),
		].sort((a, b) => a - b)
		setStart(startValue)
		setEnd(endValue)

		onChange?.([startValue, endValue])
	}, [])

	// useEffect(()=>{
	// 	refEnd.current?.addEventListener("touchstart", (e)=>{
	// 		e.preventDefault()
	// 	}, { passive: false });
	// }, [refEnd])

	return (
		<div className={cx(styles['range-input'], className)}>
			<input
				ref={refStart}
				type="range"
				className={cx('buitar-primary-range', inputClassName)}
				min={min}
				max={max}
				step={1}
				defaultValue={defaultStart}
				style={{
					background: `linear-gradient(to right, ${backgoundColor} calc(${
						(start / max) * 100
					}%), ${highLightColor} calc(${(start / max) * 100}%) calc(${
						(end / max) * 100
					}%), ${backgoundColor} 0%)`,
				}}
				onChange={setRange}
			/>

			<input
				ref={refEnd}
				type="range"
				className={cx('buitar-primary-range', styles['input-hidden'], inputClassName)}
				min={min}
				max={max}
				step={1}
				defaultValue={defaultEnd}
				onChange={setRange}
			/>
		</div>
	)
}
