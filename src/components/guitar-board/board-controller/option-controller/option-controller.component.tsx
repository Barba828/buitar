import React, { FC } from 'react'
import { GuitarBoardOptions } from '../controller.type'
import { useBoardContext } from '../../board-provider'
import { instrumentConfig } from '@/utils/tone-player/tone.config'
import { Instrument } from '@/utils/tone-player/instrument.type'
import { Icon } from '@/components/icon'
import { optionsUIConfig, instrumentUIConfig } from './controller.config'
import { ControllerList } from '../controller'
import cx from 'classnames'
import styles from './option-controller.module.scss'

export interface ControllerProps {
	disableAnimation?: boolean
}

export const OPTIONS_KEY = 'options'
export const INSTRUMENT_KEY = 'instrument'

export const BoardController: FC<ControllerProps> = (props) => {
	return (
		<div className={styles['container']}>
			<BoardOptionsController {...props} />
			<BoardInstrumentController {...props} />
		</div>
	)
}

/**
 * 指板显示内容选项
 * @param props
 * @returns
 */
export const BoardOptionsController: FC<ControllerProps> = (props) => {
	const { boardOptions, dispatchBoardOptions } = useBoardContext()

	const handleClick = (option: keyof GuitarBoardOptions) => {
		dispatchBoardOptions({
			type: 'set',
			payload: { ...boardOptions, [option]: !boardOptions[option] },
		})
	}

	const renderOptionItem = (option: keyof GuitarBoardOptions) => {
		const checkedItem = boardOptions[option]
			? optionsUIConfig[option].checked
			: optionsUIConfig[option].unchecked
		const uncheckedItem = !boardOptions[option]
			? optionsUIConfig[option].checked
			: optionsUIConfig[option].unchecked

		return (
			<div className={styles['controller-inner']}>
				{checkedItem.name_zh}
				<div className={styles['controller-inner-unchecked']}>{uncheckedItem.name_zh}</div>
				<div className={cx(styles['controller-inner-unchecked'], styles['controller-inner-intro'])}>
					{optionsUIConfig[option].others.intro_zh}
				</div>
			</div>
		)
	}

	const list = Object.keys(boardOptions) as (keyof GuitarBoardOptions)[]
	// 默认展示选中的option，若未选中，则展示「isShowSemitone」
	const checkedList = list.filter((option) => boardOptions[option])
	return (
		<ControllerList
			{...props}
			list={list}
			onClickItem={handleClick}
			renderListItem={renderOptionItem}
			checkedItem={(option) => boardOptions[option]}
			visibleItem={(option) => (checkedList.length > 0 ? false : option === 'isShowSemitone')}
			itemClassName={() => styles['controller-inner-option']}
		/>
	)
}

/**
 * 指板播放乐器选项
 * @param props
 * @returns
 */
export const BoardInstrumentController: FC<ControllerProps> = (props) => {
	const { instrument, dispatchInstrument } = useBoardContext()

	const renderInstrumentItem = (instrument: Instrument) => {
		return (
			<div className={styles['controller-inner']}>
				<span>{instrumentUIConfig[instrument].name_zh}</span>
				<Icon name={instrumentUIConfig[instrument].icon} size={30} />
			</div>
		)
	}

	const handleClick = (instrument: Instrument) => {
		dispatchInstrument({ type: 'set', payload: instrument })
	}

	return (
		<ControllerList
			{...props}
			list={Object.keys(instrumentConfig) as Instrument[]}
			onClickItem={handleClick}
			checkedItem={(item) => item === instrument}
			renderListItem={renderInstrumentItem}
		/>
	)
}
