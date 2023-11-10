import { FC, useEffect, useState } from 'react'
import { AddTextInput, CollectionSelecter } from '@/components/basic'
import { CollectionChord } from '@/pages/collections/collections.config'
import { Modal, ModalProps, toast } from '@/components/portal'
import { useBoardContext } from '@/components/guitar-board'
import cx from 'classnames'

import styles from './chord-card.module.scss'

export const CardCollector: FC<
	{
		data: CollectionChord
		className?: string
	} & Partial<ModalProps>
> = ({ data, className, ...restProps }) => {
	const { collection, dispatchCollection, instrumentKeyboard } = useBoardContext()
	const [collectionIndex, setCollectionIndex] = useState<number>(0)

	// 更新选中收藏夹
	useEffect(() => {
		setCollectionIndex(collection[instrumentKeyboard].length - 1)
	}, [collection, instrumentKeyboard])

	const handleAddCollection = (title: string) => {
		collection[instrumentKeyboard].push({ title: title, intro: '', data: [] })
		dispatchCollection({ type: 'set', payload: collection })
	}

	const handleConfirm = (e: any) => {
		collection[instrumentKeyboard][collectionIndex].data.push(data)
		dispatchCollection({ type: 'set', payload: collection })
		toast('已加入收藏夹' + collection[instrumentKeyboard][collectionIndex].title)
		restProps.onCancel?.(e)
	}

	return (
		<Modal {...restProps} onConfirm={handleConfirm} title="加入收藏">
			<div className={cx(styles['collection-type'], className)}>
				<CollectionSelecter
					list={collection[instrumentKeyboard].map((item) => item.title)}
					onChange={(_title, index) => {
						setCollectionIndex(index)
					}}
					checkedIndex={collectionIndex}
				/>
				<AddTextInput onConfirm={handleAddCollection} placeholder="请输入收藏夹名称" />
			</div>
		</Modal>
	)
}
