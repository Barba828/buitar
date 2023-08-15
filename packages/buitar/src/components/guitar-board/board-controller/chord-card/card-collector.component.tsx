import { FC, useState } from 'react'
import { AddTextInput, CollectionSelecter } from '@/components/basic'
import { CollectionChord } from '@/pages/collections/collections.config'
import cx from 'classnames'
import { Modal, ModalProps } from '@/components/portal/Modal.component'
import { useBoardContext } from '@/components/guitar-board'

import styles from './chord-card.module.scss'

export const CardCollector: FC<
	{
		data: CollectionChord
		className?: string
	} & Partial<ModalProps>
> = ({ data, className, ...restProps }) => {
	const { collection, dispatchCollection, instrumentKeyboard } = useBoardContext()
	const [collectionIndex, setCollectionIndex] = useState<number>(0)

	const handleAddCollection = (title: string) => {
		collection[instrumentKeyboard].push({ title: title, intro: '', data: [] })
		dispatchCollection({ type: 'set', payload: collection })
	}

	const handleConfirm = () => {
		collection[instrumentKeyboard][collectionIndex].data.push(data)
		dispatchCollection({ type: 'set', payload: collection })
		restProps.onCancel?.()
	}

	return (
		<Modal {...restProps} onConfirm={handleConfirm} title="加入收藏">
			<div className={cx(styles['collection-type'], className)}>
				<CollectionSelecter
					list={collection[instrumentKeyboard].map((item) => item.title)}
					onChange={(_title, index) => {
						setCollectionIndex(index)
					}}
				/>
				<AddTextInput onConfirm={handleAddCollection} />
			</div>
		</Modal>
	)
}
