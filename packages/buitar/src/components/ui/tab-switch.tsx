import { useState } from 'react'
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
	const [checkedIndex, setCheckedIndex] = useState(defaultValue ? values.indexOf(defaultValue) : 0)
	const handleChange = (item: any, index: number) => {
		setCheckedIndex(index)
		onChange?.(item, index)
	}

	return (
		<div className={cx(styles['tab-switch'], className)}>
			{values.map((item, index) => (
				<div
					key={index}
					onClick={() => handleChange(item, index)}
					className={cx(
						styles['tab-switch-item'],
						checkedIndex === index && styles['tab-switch-item__active']
					)}
				>
					{renderTabItem ? renderTabItem(item, checkedIndex === index) : item}
				</div>
			))}
			<div
				className={cx(styles['tab-switch-item__cursor'])}
				style={{
					width: `calc(${100 / values.length}% - 4px)`,
					left: `${(checkedIndex / values.length) * 100}%`,
					display: checkedIndex > -1 ? 'block' : 'none',
				}}
			></div>
		</div>
	)
}
