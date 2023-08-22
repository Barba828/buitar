import React, { useCallback, useEffect, useRef, useState } from 'react'
import type { RangeInputProps } from './range-input'
import cx from 'classnames'

import styles from './range-slider.module.scss'

export type RangeSliderProps = Omit<RangeInputProps, 'defaultValue'> & {
	size?: number
	defaultValue?: number
}

/**
 * 固定宽度的拖拽范围选择器
 * @param param0
 * @returns
 */
export const RangeSlider = ({
	range: [min, max] = [0, 16],
	size = Math.floor((max - min) / 4),
	defaultValue = 0,
	onChange,
	backgoundColor = 'rgb(94, 101, 105)',
	highLightColor = '#ccc',
	step,
	className,
	inputClassName,
}: RangeSliderProps) => {
	const [value, setValue] = useState(defaultValue)
	const ref = useRef(null)

	const handleChange = useCallback((e) => {
		const value = Math.round(Number(e?.target?.value || 0))
		setValue(value)
	}, [])

	useEffect(() => {
		onChange?.([value, Math.min(value + size - 1, max)])
	}, [size, value])

	return (
		<div
			className={cx(styles['range-slider'], className)}
			style={
				{
					'--thumb-width': `${(size / (max - min)) * 100}%`,
					'--thumb-color': highLightColor,
				} as any
			}
		>
			<input
				ref={ref}
				type="range"
				className={cx('primary-range', inputClassName)}
				min={min}
				max={max}
				step={step ? step : ((max - min) / 100).toFixed(1)}
				defaultValue={value}
				style={{ background: backgoundColor }}
				onChange={handleChange}
			/>
		</div>
	)
}
