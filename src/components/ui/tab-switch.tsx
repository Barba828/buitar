import React, { useState } from 'react'
import cx from 'classnames'
import styles from './tab-switch.module.scss'

interface ControllerListProps<T> {
	defaultValue?: T
	values: T[]
	onChange?: (value: T, index: number) => void
	renderTabItem?: (item: T, checked?: boolean) => JSX.Element | string
	className?: string
}

export const TabSwitch: <T>(props: ControllerListProps<T>) => JSX.Element = ({
	defaultValue,
	values,
	onChange,
	renderTabItem,
	className,
}) => {
	const [value, setValue] = useState(defaultValue || values[0])
	const handleChange = (item: any, index: number) => {
		setValue(item)
		onChange?.(item, index)
	}

	return (
		<div className={cx(styles.switch, className)}>
			{values.map((item, index) => (
				<div
					onClick={() => handleChange(item, index)}
					className={cx(styles['switch-item'], item === value && styles['switch-item__active'])}
				>
					{renderTabItem ? renderTabItem(item, item === value) : item}
				</div>
			))}
			<div
				className={cx(styles['switch-item__cursor'])}
				style={{
					width: `calc(${100 / values.length}% - 4px)`,
					left: `${(values.indexOf(value) / values.length) * 100}%`,
				}}
			></div>
		</div>
	)
}
