import { FC } from 'react'
import { ChordType, Point } from '@buitar/to-guitar'
import { ChordCard, useBoardContext } from '../guitar-board'
import { Icon } from '@/components/icon'
import { useConfigContext } from '../slide-menu/config-provider'
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
	className?: string
	titleClassName?: string
}> = ({ data, title, intro, disableCollect, titleClassName, className, index }) => {
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
				<div className={cx(styles['title-text'], 'primary-button', 'touch-yellow')}>
					{title}
				</div>
				{!disableCollect && (
					<div className={cx(styles['title-btn'], 'primary-button', 'touch-primary')}>
						<Icon name="icon-delete" onClick={handleRemoveCollection} />
					</div>
				)}
				{intro && <div className={cx(styles['title-sub-text'])}>{intro}</div>}
			</div>
			<div className={cx(styles['data-list'], 'scroll-without-bar')}>{dataView}</div>
		</div>
	)
}
