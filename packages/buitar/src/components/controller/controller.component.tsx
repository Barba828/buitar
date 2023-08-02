import cx from 'classnames'
import styles from './controller.module.scss'

export interface ControllerProps<T> {
	onClickItem?: (item: T, index?: number) => void
	renderListItem?: (item: T, checked?: boolean) => JSX.Element
	size?: 'small' | 'medium' | 'large'

	checkedItem?: (item: T) => boolean
	visibleItem?: (item: T) => boolean
	invisibleItem?: (item: T) => boolean
	itemClassName?: (item: T) => string
}

export interface ControllerListProps<T> extends ControllerProps<T> {
	list?: T[]
	className?: string
	/**
	 * 水平滚动显示
	 */
	scrollable?: boolean
	/**
	 * 全部展开可选项
	 */
	extendItem?: boolean
}

export const ControllerList: <T>(props: ControllerListProps<T>) => JSX.Element = ({
	list = [],
	className,
	scrollable = true,
	size = 'medium',
	onClickItem,
	renderListItem,
	checkedItem,
	visibleItem,
	invisibleItem,
	itemClassName,
	extendItem = true,
}) => {
	const controllerView = list.map((item, index) => {
		const handleClick = () => {
			onClickItem?.(item, index)
		}

		const cls = cx(
			'buitar-primary-button',
			extendItem
				? styles['controller']
				: visibleItem?.(item)
				? styles['controller']
				: styles['controller-not-extend'],
			styles[`controller-extend__${size}`],
			checkedItem?.(item) && styles['controller-checked'],
			invisibleItem?.(item) && styles['controller-not-extend'],
			itemClassName?.(item)
		)

		return (
			<div key={`${index}`} onClick={handleClick} className={cls}>
				{renderListItem ? renderListItem(item, checkedItem?.(item)) : String(item)}
			</div>
		)
	})

	const views = (
		<div
			className={cx(
				className,
				!scrollable && styles['board-controller__wrap'],
				styles['board-controller']
			)}
		>
			{controllerView}
		</div>
	)

	if (scrollable) {
		return <div className="scroll-without-bar">{views}</div>
	}

	return views
}
