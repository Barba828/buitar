import cx from 'classnames'
import styles from './controller.module.scss'
import { Icon } from '@/components/icon'
import { FC, ReactNode, memo, useCallback, useEffect, useState } from 'react'
import { useIsHoverable } from '@/utils/hooks/use-device'

export interface ControllerProps<T> {
	onClickItem?: (item: T, index?: number) => void
	renderListItem?: (item: T, checked?: boolean) => ReactNode
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

export const ControllerList: <T>(props: ControllerListProps<T>) => any = memo(
	({
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
		const isHoverable = useIsHoverable()
		const [extend, setExtend] = useState(extendItem)
		const handleClickTrigger = useCallback(() => {
			setExtend(!extend)
		}, [extend])

		useEffect(() => {
			setExtend(extendItem)
		}, [extendItem])

		const controllerView = list.map((item, index) => {
			const handleClick = () => {
				onClickItem?.(item, index)
			}

			// 展开优先级 1.item不可见；2.list默认展开；3.item可见
			const itemExtendClass = invisibleItem?.(item)
				? styles['controller-not-extend']
				: extend
				? styles['controller-extend']
				: visibleItem?.(item)
				? styles['controller-extend']
				: styles['controller-not-extend']

			const cls = cx(
				'primary-button',
				styles[`controller`],
				styles[`controller-extend__${size}`],
				itemExtendClass,
				checkedItem?.(item) && styles['controller-checked'],
				itemClassName?.(item)
			)

			return (
				<div key={`${index}`} onClick={handleClick} className={cls}>
					{renderListItem ? renderListItem(item, checkedItem?.(item)) : String(item)}
				</div>
			)
		})

		// 非全部展开 且 不支持Hover才显示展开trigger（PC非全部展开使用Hover展开list）
		const trigger = !isHoverable && !extendItem && list.length > 0 && (
			<div
				className={cx(
					'primary-button',
					'flex-center',
					styles['controller'],
					styles['controller-extend'],
					styles[`controller-extend__${size}`],
					styles[`controller-trigger`],
					extend && styles[`controller-trigger__extend`]
				)}
				onClick={handleClickTrigger}
			>
				<Icon name="icon-play" size={14} />
			</div>
		)

		const views = (
			<div
				className={cx(
					className,
					!scrollable && styles['board-controller__wrap'],
					styles['board-controller']
				)}
			>
				{trigger}
				{controllerView}
			</div>
		)

		if (scrollable) {
			return <div className="scroll-without-bar">{views}</div>
		}

		return views
	}
)