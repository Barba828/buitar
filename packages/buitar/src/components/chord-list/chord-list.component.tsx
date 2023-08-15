import { FC } from 'react'
import { ChordType, Point } from '@buitar/to-guitar'
import { ChordCard, useBoardContext } from '../guitar-board'
import { Icon } from '@/components/icon'
import cx from 'classnames'

import styles from './chord-list.module.scss'
import { useMenuContext } from '..'

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
	titleClassName?: string
}> = ({ data, title, intro, disableCollect, titleClassName, index }) => {
	const { collection, dispatchCollection, instrumentKeyboard } = useBoardContext()
	const {isMobileDevice} = useMenuContext()

	const handleRemoveChord = (dataIndex: number) => {
		collection[instrumentKeyboard][index].data.splice(dataIndex, 1)
		dispatchCollection({ type: 'set', payload: collection })
	}

	const handleRemoveCollection = () => {
		collection[instrumentKeyboard].splice(index, 1)
		dispatchCollection({ type: 'set', payload: collection })
	}

	const dataView = data.map((item, dataIndex) => {
		return (
			<ChordCard
				key={dataIndex}
				disableCollect={disableCollect}
				onRemoveCollection={()=>handleRemoveChord(dataIndex)}
				className={styles.card}
				size={isMobileDevice ? 72 : 100}
				taps={item.taps}
				title={item.title || ' '}
			/>
		)
	})

	return (
		<div className={styles.list}>
			<div
				className={cx(
					'buitar-primary-button',
					styles['title-view'],
					'touch-yellow',
					titleClassName
				)}
			>
				{title}
				<div>{intro}</div>
				{!disableCollect && (
					<Icon
						name="icon-close"
						className={styles['list-remove']}
						onClick={handleRemoveCollection}
					/>
				)}
			</div>
			<div className={cx('scroll-without-bar')}>
				<div className={styles['data-list']}>{dataView}</div>
			</div>
		</div>
	)
}
