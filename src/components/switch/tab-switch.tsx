import React, { FC, useCallback, useState } from 'react'
import cx from 'classnames'
import styles from './tab-switch.module.scss'

interface ControllerListProps<T> {
	defaultValue?: T
	values: T[]
	onChange?: (value: T) => void
	className?: string
}

export const TabSwitch: <T>(props: ControllerListProps<T>) => JSX.Element = ({
	defaultValue,
	values,
	onChange,
	className
}) => {
	const [value, setValue] = useState(defaultValue || values[0])
	const handleChange = (item: any) => {
		setValue(item)
		onChange?.(item)
	}

	return (
		<div className={cx(styles.switch, className)}>
			{values.map((item, index) => (
				<div
					onClick={() => handleChange(item)}
					className={cx(styles['switch-item'], item === value && styles['switch-item__active'])}
				>
					{item}
				</div>
			))}
			<div
				className={cx(styles['switch-item__cursor'])}
				style={{
					width: `calc(${100 / values.length}% - 4px)`,
					left: `${values.indexOf(value) / values.length * 100}%`,
				}}
			></div>
		</div>
	)
}
