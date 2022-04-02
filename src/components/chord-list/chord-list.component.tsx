import React, { FC } from 'react'
import { ChordType, Point } from 'to-guitar'
import { ChordCard, useBoardContext } from '../guitar-board'
import cx from 'classnames'

import styles from './chord-list.module.scss'
import { Icon } from '..'

export type CollectionChord = {
	taps: Point[]
	title?: string
	chordType?: ChordType
}

export const ChordList: FC<{
	data: CollectionChord[]
	title?: string
	intro?: string
	disableCollect?: boolean
}> = ({ data, title, intro, disableCollect }) => {
	const { collection, dispatchCollection } = useBoardContext()

	const handleRemoveChord = () => {
		const index = collection.findIndex((x) => x.title === title)
		collection[index].data.splice(index, 1)
		dispatchCollection({ type: 'set', payload: collection })
	}

	const handleRemoveCollection = () => {
		const index = collection.findIndex((x) => x.title === title)
		collection.splice(index, 1)
		dispatchCollection({ type: 'set', payload: collection })
	}

	const dataView = data.map((item, index) => {
		return (
			<ChordCard
				key={index}
				disableCollect={disableCollect}
				onRemoveCollection={handleRemoveChord}
				className={styles.card}
				size={100}
				taps={item.taps}
				title={item.title}
			/>
		)
	})

	return (
		<div className={styles.list}>
			<div className={cx('buitar-primary-button', styles['title-view'], 'touch-yellow')}>
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
