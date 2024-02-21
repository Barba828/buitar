import { FC, useMemo } from 'react'
import { useBoardContext } from '@/components/guitar-board/index'
import { PercussionInstrument, StringsInstrument, instrumentType } from '@buitar/tone-player'
import { Icon } from '@/components/icon'
import {
	optionsUIConfig,
	instrumentUIConfig,
	boardStyleConfig,
	instrumentKeyboardConfig,
} from '@/pages/settings/config/controller.config'
import {
	GuitarBoardSetting,
	GuitarBoardOptionsKey,
	GuitarBoardThemeKey,
	InstrumentKeyboardKey,
} from '@/pages/settings/config/controller.type'
import { ControllerList, ControllerListProps } from '@/components/controller'
import { useDrumBoardContext } from '@/components/drum-board/drum-provider'
import cx from 'classnames'

import styles from './option-controller.module.scss'

export const BoardController: FC<
	ControllerListProps<any> & {
		controllerClassName?: string
	}
> = ({ controllerClassName, ...props }) => {
	return (
		<div className={cx(styles['container'], controllerClassName)}>
			<KeyBoardInstrument {...props} />
			<DrumInstrumentController {...props} />

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
	ControllerListProps<keyof GuitarBoardSetting> & {
		list?: GuitarBoardOptionsKey[]
	}
> = (props) => {
	const { boardSettings, dispatchBoardSettings } = useBoardContext()

	const handleClick = (option: keyof GuitarBoardSetting) => {
		dispatchBoardSettings({
			type: 'set',
			payload: { ...boardSettings, [option]: !boardSettings[option] },
		})
	}

	const renderOptionItem = (option: keyof GuitarBoardSetting) => {
		const checkedItem = boardSettings[option] ? optionsUIConfig[option].checked : optionsUIConfig[option].unchecked
		const uncheckedItem = !boardSettings[option] ? optionsUIConfig[option].checked : optionsUIConfig[option].unchecked

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

	const list = useMemo(() => {
		const arr = props.list || (Object.keys(optionsUIConfig) as GuitarBoardOptionsKey[])
		return arr.filter((item) => {
			if (item === 'isRomanInterval' && !boardSettings.hasInterval) {
				return false
			}
			if (item === 'isShowOuter' && !boardSettings.isShowUnActive) {
				return false
			}
			return true
		})
	}, [props.list, boardSettings])

	return (
		<ControllerList
			{...props}
			list={list}
			onClickItem={handleClick}
			renderListItem={renderOptionItem}
			checkedItem={(option) => boardSettings[option]}
			visibleItem={() => true}
			itemClassName={() => styles['controller-inner-option']}
		/>
	)
}

/**
 * 指板播放乐器音色选项
 * @param props
 * @returns
 */
export const BoardInstrumentController: FC<ControllerListProps<StringsInstrument>> = (props) => {
	const { instrument, dispatchInstrument } = useBoardContext()

	const renderInstrumentItem = (instrument: StringsInstrument) => {
		return (
			<div className={cx(styles['controller-inner'], styles[`controller-inner__${props.size}`])}>
				<span>{instrumentUIConfig?.[instrument]?.name_zh}</span>
				<Icon name={instrumentUIConfig?.[instrument]?.icon} size={props.size === 'small' ? 16 : 30} />
				<div className={cx(styles['controller-inner-intro'], styles['controller-inner-unchecked'])}>弦乐音色</div>
			</div>
		)
	}

	const handleClick = (instrument: StringsInstrument) => {
		dispatchInstrument({ type: 'set', payload: instrument })
	}

	return (
		<ControllerList
			{...props}
			list={instrumentType.strings as StringsInstrument[]}
			onClickItem={handleClick}
			checkedItem={(item) => item === instrument}
			renderListItem={renderInstrumentItem}
			itemClassName={() => styles['controller-inner-option']}
		/>
	)
}

/**
 * 指板播放乐器UI主题选项
 * @param props
 * @returns
 */
export const BoardThemeController: FC<ControllerListProps<GuitarBoardThemeKey>> = (props) => {
	const { boardTheme, dispatchBoardTheme } = useBoardContext()

	const renderThemeItem = (theme: GuitarBoardThemeKey) => {
		return (
			<div className={cx(styles['controller-inner'], styles[`controller-inner__${props.size}`])}>
				<span>{boardStyleConfig[theme].name}</span>
				<div className={styles['controller-inner-unchecked']}>{theme}</div>
				<div className={cx(styles['controller-inner-intro'], styles['controller-inner-unchecked'])}>乐器外观</div>
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

/**
 * 真实乐器选项
 * @param props
 * @returns
 */
export const KeyBoardInstrument: FC<ControllerListProps<InstrumentKeyboardKey>> = (props) => {
	const { instrumentKeyboard, dispatchInstrumentKeyboard } = useBoardContext()

	const renderThemeItem = (key: InstrumentKeyboardKey) => {
		const baseString = instrumentKeyboardConfig[key].baseTone?.map((item) => item.toString().slice(0, 1)).join('')
		return (
			<div className={cx(styles['controller-inner'], styles[`controller-inner__${props.size}`])}>
				<span>{instrumentKeyboardConfig[key].name}</span>
				<span style={{ opacity: 0.6 }}>{baseString}</span>
				<div className={cx(styles['controller-inner-intro'], styles['controller-inner-unchecked'])}>乐器指板</div>
			</div>
		)
	}
	return (
		<ControllerList
			{...props}
			list={Object.keys(instrumentKeyboardConfig) as InstrumentKeyboardKey[]}
			renderListItem={renderThemeItem}
			onClickItem={(key) => dispatchInstrumentKeyboard({ type: 'set', payload: key })}
			checkedItem={(key) => key === instrumentKeyboard}
			itemClassName={() => styles['controller-inner-option']}
		></ControllerList>
	)
}

/**
 * 鼓机乐器选项
 * @param props
 * @returns
 */
export const DrumInstrumentController: FC<ControllerListProps<PercussionInstrument>> = (props) => {
	const { instrument, dispatchInstrument } = useDrumBoardContext()

	const renderInstrumentItem = (instrument: PercussionInstrument) => {
		return (
			<div className={cx(styles['controller-inner'], styles[`controller-inner__${props.size}`])}>
				<span>{instrumentUIConfig?.[instrument]?.name_zh}</span>
				<Icon name={instrumentUIConfig?.[instrument]?.icon} size={props.size === 'small' ? 12 : 24} />
				<div className={cx(styles['controller-inner-intro'], styles['controller-inner-unchecked'])}>打击乐器</div>
			</div>
		)
	}

	const handleClick = (instrument: PercussionInstrument) => {
		dispatchInstrument({ type: 'set', payload: instrument })
	}

	return (
		<ControllerList
			{...props}
			list={instrumentType.percussion as PercussionInstrument[]}
			onClickItem={handleClick}
			checkedItem={(item) => item === instrument}
			renderListItem={renderInstrumentItem}
			itemClassName={() => styles['controller-inner-option']}
		/>
	)
}
