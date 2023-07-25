import React, { FC, useCallback, useState } from 'react'
import cx from 'classnames'
import styles from './switch.module.scss'

export const Switch: FC<{ defaultValue?: boolean; onChange?: (value: boolean) => void }> = ({
	defaultValue,
	onChange,
}) => {
	const [value, setValue] = useState(!!defaultValue)
	const handleChange = useCallback(() => {
		setValue(!value)
		onChange?.(!value)
	}, [value])
	return (
		<div className={cx(styles.switch, value && styles['switch-on'])} onClick={handleChange}>
			<div className={styles.circle}></div>
		</div>
	)
}
