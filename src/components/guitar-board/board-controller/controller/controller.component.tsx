import React from 'react'
import cx from 'classnames'
import { ControllerProps } from '../option-controller/option-controller.component'
import styles from './controller.module.scss'

interface ControllerListProps<T> extends ControllerProps {
	list: T[]
	className?: string
	/**
	 * 水平滚动显示
	 */
	scrollable?: boolean
	onClickItem: (item: T, index?: number) => void
	renderListItem: (item: T, checked?: boolean) => JSX.Element

	checkedItem?: (item: T) => boolean
	visibleItem?: (item: T) => boolean
	invisibleItem?: (item: T) => boolean
	itemClassName?: (item: T) => string
}

export const ControllerList: <T>(props: ControllerListProps<T>) => JSX.Element = ({
	list,
	className,
	scrollable = true,
	onClickItem,
	renderListItem,
	checkedItem,
	visibleItem,
	invisibleItem,
	itemClassName,
	disableAnimation,
}) => {
	const controllerView = list.map((item, index) => {
		const handleClick = () => {
			onClickItem(item, index)
		}

		const cls = cx(
			'buitar-primary-button',
			styles['controller'],
			checkedItem?.(item) && styles['controller-checked'],
			visibleItem?.(item) && styles['controller-extend'],
			invisibleItem?.(item) && styles['controller-not-extend'],
			itemClassName?.(item)
		)

		return (
			<div key={`${index}`} onClick={handleClick} className={cls}>
				{renderListItem(item, checkedItem?.(item))}
			</div>
		)
	})

	const views = (
		<div
			className={cx(
				className,
				!disableAnimation && styles['board-controller-animation'],
				!scrollable && styles['board-controller__wrap'],
				styles['board-controller'],
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
