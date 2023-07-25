import React, { FC, useEffect, useState } from 'react'
import { AddTextInput, CollectionSelecter } from '@/components/basic'
import { CollectionType, COLLECTIONS_KEY, CollectionChord } from '@/pages/collections'
import { useStore } from '@/utils/hooks/use-store'
import { Icon } from '@/components'

import cx from 'classnames'
import styles from './chord-card.module.scss'

export const CardCollector: FC<{
	data: CollectionChord
	onCancel?: () => void
	className?: string
}> = ({ data, className, onCancel }) => {
	const [collection, dispatchCollection] = useStore<CollectionType[]>(COLLECTIONS_KEY, [])
	const [collectionTitle, setCollectionTitle] = useState<string>(collection[0]?.title || '')

	const handleAddCollection = (title: string) => {
		collection.push({ title: title, intro: '', data: [] })
		dispatchCollection({ type: 'set', payload: collection })
	}

	const handleConfirm = () => {
		const index = collection.findIndex((x) => x.title === collectionTitle)
		collection[index].data.push(data)
		dispatchCollection({ type: 'set', payload: collection })
		onCancel?.()
	}

	const handleCancel = () => {
		onCancel?.()
	}

	return (
		<div className={cx(styles['collection-type'], className)}>
			<CollectionSelecter
				list={collection.map((item) => item.title)}
				onChange={(title) => {
					setCollectionTitle(title)
				}}
			/>
			{data.taps.length > 0 && (
				<div className={styles['buttons']}>
					<div className={cx('buitar-primary-button', styles['confirm'])} onClick={handleCancel}>
						<Icon name="icon-close" />
					</div>
					<div className={cx('buitar-primary-button', styles['confirm'])} onClick={handleConfirm}>
						<Icon name="icon-confirm" />
					</div>
				</div>
			)}
			<AddTextInput onConfirm={handleAddCollection} />
		</div>
	)
}
