import { useEffect, useState } from 'react'
import { TabSwitchProps } from './tab-switch'
import { Icon } from '@/components/icon'
import cx from 'classnames'

import styles from './radio-selector.module.scss'

export const RadioSelector: <T>(props: TabSwitchProps<T>) => JSX.Element = ({
	defaultValue,
	values,
	onChange,
	renderItem,
	className,
}) => {
	const [checkedIndex, setCheckedIndex] = useState(defaultValue ? values.indexOf(defaultValue) : 0)
    
	useEffect(() => {
		onChange?.(values[checkedIndex], checkedIndex)
	}, [checkedIndex])

	return (
		<div className={cx(styles['radio-selector'], className)}>
			<div
				className={cx(
					'primary-button',
					styles['selector-btn'],
					checkedIndex === 0 && styles['selector-btn__disabled']
				)}
				onClick={() => setCheckedIndex(checkedIndex - 1)}
			>
				<Icon name="icon-back" />
			</div>

			{renderItem ? (
				renderItem(values[checkedIndex], true)
			) : (
				<div className={cx(styles['selector-content'])}>{values[checkedIndex]}</div>
			)}

			<div
				className={cx(
					'primary-button',
					styles['selector-btn'],
					checkedIndex === values.length - 1 && styles['selector-btn__disabled'],
					styles['selector-btn__rotate']
				)}
				onClick={() => setCheckedIndex(checkedIndex + 1)}
			>
				<Icon name="icon-back" />
			</div>
		</div>
	)
}
