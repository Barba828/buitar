import { FC } from 'react'
import { useBoardContext } from '@/components/guitar-board/index'
import { instrumentConfig } from '@buitar/tone-player/tone.config'
import { Instrument } from '@buitar/tone-player/instrument.type'
import { Icon } from '@/components/icon'
import { optionsUIConfig, instrumentUIConfig, boardStyleConfig } from './controller.config'
import {
	GuitarBoardOptions,
	GuitarBoardOptionsKey,
	GuitarBoardThemeKey,
} from '@/components/guitar-board/board-controller'
import { ControllerList, ControllerListProps } from '@/components/controller'
import { useMenuContext } from '@/components/slide-menu/menu-provider'
import cx from 'classnames'

import styles from './option-controller.module.scss'

export const OPTIONS_KEY = 'options'
export const INSTRUMENT_KEY = 'instrument'
export const BOARD_THEME_KEY = 'board_theme'

export const BoardController: FC<
	ControllerListProps<any> & {
		controllerClassName?: string
		/**
		 * 可见（忽略menu设置）
		 */
		ignore?: boolean
	}
> = (props) => {
	return (
		<div className={cx(styles['container'], props.controllerClassName)}>
			<BoardOptionsController {...props} />
			<BoardInstrumentController {...props} />
			<BoardThemeController {...props} />
		</div>
	)
}

/**
 * 指板显示内容选项
 * @param props
 * @returns
 */
export const BoardOptionsController: FC<
	ControllerListProps<keyof GuitarBoardOptions> & { ignore?: boolean }
> = (props) => {
	const { boardOptions, dispatchBoardOptions } = useBoardContext()
	const { menus } = useMenuContext()

	if (!menus.board_setting && !props.ignore) {
		return null
	}

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
			<div className={cx(styles['controller-inner'], styles[`controller-inner__${props.size}`])}>
				{checkedItem.name_zh}
				<div className={styles['controller-inner-unchecked']}>{uncheckedItem.name_zh}</div>
				<div
					className={cx(
						styles['controller-inner-unchecked'],
						props.size !== 'small' && styles['controller-inner-intro']
					)}
				>
					{optionsUIConfig[option].others.intro_zh}
				</div>
			</div>
		)
	}

	const list = Object.keys(optionsUIConfig) as GuitarBoardOptionsKey[]
	// 默认展示选中的option，若全都未选中，则展示「isShowSemitone」
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
export const BoardInstrumentController: FC<
	ControllerListProps<Instrument> & { ignore?: boolean }
> = (props) => {
	const { instrument, dispatchInstrument } = useBoardContext()
	const { menus } = useMenuContext()

	if (!menus.instrument_setting && !props.ignore) {
		return null
	}

	const renderInstrumentItem = (instrument: Instrument) => {
		return (
			<div className={cx(styles['controller-inner'], styles[`controller-inner__${props.size}`])}>
				<span>{instrumentUIConfig[instrument].name_zh}</span>
				<Icon name={instrumentUIConfig[instrument].icon} size={props.size === 'small' ? 16 : 30} />
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

/**
 * 指板播放乐器选项
 * @param props
 * @returns
 */
export const BoardThemeController: FC<
	ControllerListProps<GuitarBoardThemeKey> & { ignore?: boolean }
> = (props) => {
	const { boardTheme, dispatchBoardTheme } = useBoardContext()
	const { menus } = useMenuContext()

	if (!menus.instrument_setting && !props.ignore) {
		return null
	}

	const renderThemeItem = (theme: GuitarBoardThemeKey) => {
		return (
			<div className={cx(styles['controller-inner'], styles[`controller-inner__${props.size}`])}>
				<span>{boardStyleConfig[theme].name}</span>
				<div className={styles['controller-inner-unchecked']}>{theme}</div>
				<div className={cx(styles['controller-inner-intro'], styles['controller-inner-unchecked'])}>指板风格</div>
			</div>
		)
	}

	const handleClick = (theme: GuitarBoardThemeKey) => {
		dispatchBoardTheme({ type: 'set', payload: theme })
	}

	return (
		<ControllerList
			{...props}
			list={Object.keys(boardStyleConfig) as GuitarBoardThemeKey[]}
			onClickItem={handleClick}
			checkedItem={(item) => item === boardTheme}
			renderListItem={renderThemeItem}
			itemClassName={() => styles['controller-inner-option']}
		/>
	)
}
