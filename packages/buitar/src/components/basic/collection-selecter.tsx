import { FC } from 'react'
import styles from './collection-selecter.module.scss'

export const CollectionSelecter: FC<{ list: string[]; onChange?: (x: string, index: number) => void }> = ({
	list,
	onChange,
}) => {
	return (
		<div className={styles.selector}>
			<select
				onChange={(e) => {
					onChange?.(e.target.value, e.target.selectedIndex)
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
