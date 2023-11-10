import { FC } from 'react'
import { ChordType, Point } from '@buitar/to-guitar'
import { ChordCard, useBoardContext } from '../guitar-board'
import { Icon } from '@/components/icon'
import { useConfigContext } from '@/components/slide-menu/config-provider'
import { DragableList, type DragableListProps } from '@/components/basic'

import cx from 'classnames'
import styles from './chord-list.module.scss'

export type CollectionChord = {
	taps: Point[]
	title?: string
	chordType?: ChordType
}

export const ChordList: FC<{
	data: CollectionChord[]
	index: number
	title?: string
	intro?: string
	disableCollect?: boolean
	disableDrag?: boolean
	className?: string
	titleClassName?: string
}> = ({ data, title, intro, disableCollect, disableDrag, titleClassName, className, index }) => {
	const { collection, dispatchCollection, instrumentKeyboard } = useBoardContext()
	const { isMobileDevice } = useConfigContext()

	const handleRemoveChord = (dataIndex: number) => {
		collection[instrumentKeyboard][index].data.splice(dataIndex, 1)
		dispatchCollection({ type: 'set', payload: collection })
	}

	const handleRemoveCollection = () => {
		collection[instrumentKeyboard].splice(index, 1)
		dispatchCollection({ type: 'set', payload: collection })
	}

	const handleDragEnd: DragableListProps['onDragEnd'] = (result) => {
		if (!result.destination) return // 如果没有目标位置，不执行任何操作
		const items = Array.from(data)
		const [reorderedItem] = items.splice(result.source.index, 1)
		items.splice(result.destination.index, 0, reorderedItem)

		collection[instrumentKeyboard][index].data = items
		dispatchCollection({ type: 'set', payload: collection })
	}

	const dataView = data.map((item, dataIndex) => {
		return (
			<ChordCard
				key={dataIndex}
				disableCollect={disableCollect}
				onRemoveCollection={() => handleRemoveChord(dataIndex)}
				className={styles.card}
				size={isMobileDevice ? 72 : 100}
				taps={item.taps}
				title={item.title || ' '}
			/>
		)
	})

	return (
		<div className={cx(styles.list, className)}>
			<div className={cx(styles['title-view'], titleClassName)}>
				<div className={cx(styles['title-text'], 'primary-button', 'touch-yellow')}>{title}</div>
				{!disableCollect && (
					<div className={cx(styles['title-btn'], 'primary-button', 'touch-primary')}>
						<Icon name="icon-delete" onClick={handleRemoveCollection} />
					</div>
				)}
				{intro && <div className={cx(styles['title-sub-text'])}>{intro}</div>}
			</div>
			{disableDrag ? (
				<div className={cx(styles['data-list'], 'scroll-without-bar')}>{dataView}</div>
			) : (
				<DragableList
					className={cx(styles['data-list'], 'scroll-without-bar')}
					list={dataView}
					onDragEnd={handleDragEnd}
				></DragableList>
			)}
		</div>
	)
}
