import { ReactNode, useState } from 'react'
import cx from 'classnames'
import styles from './tab-switch.module.scss'

export interface TabSwitchProps<T> {
	defaultValue?: T
	values: T[]
	onChange?: (value: T, index: number) => void
	renderItem?: (item: T, checked?: boolean) => ReactNode|JSX.Element
	className?: string
}

export const TabSwitch: <T>(props: TabSwitchProps<T>) => JSX.Element = ({
	defaultValue,
	values,
	onChange,
	renderItem,
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
					{renderItem ? renderItem(item, checkedIndex === index) : item}
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
