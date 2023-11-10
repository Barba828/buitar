import { FC } from 'react'
import { Icon } from '@/components/icon'
import styles from './collection-selecter.module.scss'
import cx from 'classnames'

export const CollectionSelecter: FC<{
	checkedIndex?: number
	list: string[]
	onChange?: (x: string, index: number) => void
}> = ({ list, checkedIndex, onChange }) => {
	return (
		<div className={cx(styles.selector, 'scroll-without-bar')}>
			{list.map((item, index) => (
				<div
					key={item}
					className={cx(
						'primary-button',
						'flex-center',
						styles['selector-item'],
						checkedIndex === index && styles['selector-item__checked']
					)}
					onClick={() => {
						if (index !== checkedIndex) {
							onChange?.(item, index)
						}
					}}
				>
					<Icon name="icon-dir"></Icon>
					{item}
				</div>
			))}
		</div>
	)
}
