import React, { FC } from 'react'
import styles from './collection-selecter.module.scss'

export const CollectionSelecter: FC<{ list: string[]; onChange?: (x: string) => void }> = ({
	list,
	onChange,
}) => {
	return (
		<div className={styles.selector}>
			<select
				onChange={(e) => {
					onChange?.(e.target.value)
				}}
			>
				{list.map((item) => (
					<option key={item} value={item}>
						{item}
					</option>
				))}
			</select>
		</div>
	)
}
