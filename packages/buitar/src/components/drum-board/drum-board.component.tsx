import { DrumPlayer } from '@buitar/tone-player'
import { FC, useEffect, useMemo, useState } from 'react'
import cx from 'classnames'
import styles from './drum-board.module.scss'
import { useBoardTouch, useDrumKeyDown } from '@/utils/hooks/use-board-event'

export interface DrumBoardProps {
	player: DrumPlayer
}

export const DrumBoard: FC<DrumBoardProps> = ({ player }) => {
	const [keys, setKeys] = useState<string[]>([])
	const drumKeyList = useMemo(() => {
		const drumConfig = player.getDrumConfig()
		return Object.keys(drumConfig)
	}, [player.getInstrument()])

	const { active, handler } = useBoardTouch(keys, setKeys)
	const { keyActive, keyHandler } = useDrumKeyDown(keys, setKeys, drumKeyList)

	useEffect(() => {
		if (keys.length === 0) {
			return
		}
		console.log(
			'%c Drumkits ',
			'color:white; background:rgb(168, 168, 18);border-radius: 2px',
			keys
		)
	}, [keys])

	useEffect(() => {
		if (!active && !keyActive) {
			return
		}
		if (active.length) {
			console.log('triggerDrum', active);
			
			player.triggerDrum(active)
		}
		if (keyActive.length) {
			player.triggerDrum(keyActive)
		}
	}, [keyActive, active])

	return (
		<div id="drum-board" className={cx(styles['drum-wrap'])} {...handler} {...keyHandler}>
			{drumKeyList.map((key) => (
				<div
					data-key={key}
					key={key}
					className={cx(
						styles['drum-item'],
						'touch-primary',
						'buitar-primary-button',
						'flex-center',
						keys.includes(key) && styles['drum-item__active']
					)}
				>
					{key}
				</div>
			))}
		</div>
	)
}
