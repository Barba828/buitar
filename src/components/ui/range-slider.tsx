import React, { useCallback } from 'react'
import type { RangeInputProps } from './range-input'
import cx from 'classnames'

import styles from './range-slider.module.scss'

export type RangeSliderProps = Omit<RangeInputProps, 'defaultValue'> & {
	size?: number
	defaultValue?: number
}

/**
 * 带左右范围的range input选择器
 * @param param0
 * @returns
 */
export const RangeSlider = ({
	range: [min, max] = [0, 16],
	size = Math.floor((max - min) / 4),
	defaultValue = 0,
	onChange,
	backgoundColor = '#eee4',
	highLightColor = '#ccc',
	className,
}: RangeSliderProps) => {
	const handleChange = useCallback((e) => {
		const value = Number(e?.target?.value || 0)
		onChange?.([value, value + size])
	}, [size])

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
				type="range"
				className="buitar-primary-range"
				min={min}
				max={max}
				step={1}
				defaultValue={defaultValue}
				style={{ background: backgoundColor }}
				onChange={handleChange}
			/>
		</div>
	)
}
