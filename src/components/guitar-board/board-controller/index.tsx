import React, { FC } from 'react'
import cx from 'classnames'
import styles from './board-controller.module.scss'
import { GuitarBoardOptions, GuitarBoardOptionsKey } from '../controller.type'
import { useBoardContext } from '../board-provider'
import { instrumentConfig } from '@/utils/tone-player/tone.config'
import { Instrument } from '@/utils/tone-player/instrument.type'
import { Icon } from '@/components/icon'

interface BoardControllerProps {
	disableAnimation?: boolean
}

export const BoardController: FC<BoardControllerProps> = (props) => {
	return (
		<div className={styles['container']}>
			<BoardOptionsController {...props} />
			<BoardInstrumentController {...props} />
		</div>
	)
}

const optionsUIConfig: { [K in GuitarBoardOptionsKey]: any } = {
	hasRising: {
		name_zh: '全部展示',
	},
	isRising: { name_zh: '#/b' },
	isNote: { name_zh: 'Note' },
	hasLevel: { name_zh: '八度' },
}

export const BoardOptionsController: FC<BoardControllerProps> = ({ disableAnimation }) => {
	const { boardOptions, setBoardOptions } = useBoardContext()
	const controllerView = (Object.keys(boardOptions) as (keyof GuitarBoardOptions)[]).map(
		(option) => {
			if (option === 'isRising' && !boardOptions.hasRising) {
				return null
			}

			const handleClick = () => {
				setBoardOptions({ ...boardOptions, [option]: !boardOptions[option] })
			}

			const cls = cx(
				'buitar-primary-button',
				styles['controller'],
				boardOptions[option] && styles['controller-checked'],
				option === 'hasRising' && styles['controller-extend']
			)

			return (
				<div key={option} onClick={handleClick} className={cls}>
					<div className={styles['controller-inner']}>{optionsUIConfig[option].name_zh}</div>
				</div>
			)
		}
	)

	return (
		<div
			className={cx(
				styles['board-controller'],
				!disableAnimation && styles['board-controller-animation']
			)}
		>
			{controllerView}
		</div>
	)
}

const instrumentUIConfig: { [K in Instrument]: any } = {
	'guitar-acoustic': {
		name: 'Acoustic',
		name_zh: '木吉他',
		icon: 'icon-acoustic-guitar',
	},
	'guitar-electric': {
		name: 'Electric',
		name_zh: '电吉他',
		icon: 'icon-electric-guitar',
	},
	'guitar-nylon': {
		name: 'Nylon',
		name_zh: '尼龙吉他',
		icon: 'icon-nylon-guitar',
	},
	default: {
		name: 'Piano',
		name_zh: '钢琴',
		icon: 'icon-piano',
	},
}

export const BoardInstrumentController: FC<BoardControllerProps> = ({ disableAnimation }) => {
	const { instrument, setInstrument } = useBoardContext()
	const controllerView = (Object.keys(instrumentConfig) as Instrument[]).map((item) => {
		const handleClick = () => {
			setInstrument(item)
		}

		const cls = cx(
			'buitar-primary-button',
			styles['controller'],
			item === instrument && styles['controller-checked']
		)

		return (
			<div key={item} onClick={handleClick} className={cls}>
				<div className={styles['controller-inner']}>
					<span>{instrumentUIConfig[item].name_zh}</span>
					<Icon name={instrumentUIConfig[item].icon} size={30} />
				</div>
			</div>
		)
	})

	return (
		<div
			className={cx(
				styles['board-controller'],
				!disableAnimation && styles['board-controller-animation']
			)}
		>
			{controllerView}
		</div>
	)
}
