import React, { useCallback } from 'react'
import { ControllerList } from '@/components/guitar-board/board-controller'
import { modeConfigs, ModeConfigType } from './tone-mode.config'
import { ModeType } from '@to-guitar'
import cx from 'classnames'

import componentStyles from './tone-mode-controller.module.scss'
import styles from '../chord-controller/chord-controller.module.scss'

export const ToneModeController = ({
	mode,
	className,
	onClick,
}: {
	/**
	 * 选中的调式
	 */
	mode: ModeType,
	className?: string
	onClick?(item: ModeType): void
}) => {
	const handleClick = useCallback((item: ModeConfigType) => {
		onClick?.(item.key)
	}, [])

	const renderInstrumentItem = (item: ModeConfigType) => {
		return (
			<div className={styles['chord-item']}>
				<div className={styles['chord-item-grade']}>{item.title}</div>
				<div className={styles['chord-item-note']}>{item.subTitle}</div>
				<div className={styles['chord-item-scale']}>{item.desc}</div>
			</div>
		)
	}
	return (
		<ControllerList
			scrollable={false}
			list={modeConfigs}
			onClickItem={handleClick}
			checkedItem={(item) => item.key === mode}
			visibleItem={() => true}
			renderListItem={renderInstrumentItem}
			className={cx(styles['container'], componentStyles['mode-container'], className)}
		/>
	)
}
