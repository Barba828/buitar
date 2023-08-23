import { DrumPlayer, PercussionInstrument } from '@buitar/tone-player'
import { FC, useEffect, useMemo, useState } from 'react'
import cx from 'classnames'
import styles from './drum-board.module.scss'
import { useBoardTouch, useDrumKeyDown } from '@/utils/hooks/use-board-event'

export interface DrumBoardProps {
	player: DrumPlayer,
	instrument: PercussionInstrument
}

export const DrumBoard: FC<DrumBoardProps> = ({ player, instrument }) => {
	const [keys, setKeys] = useState<string[]>([])
	const drumKeyList = useMemo(() => {
		const drumConfig = DrumPlayer.getDrumConfig(instrument)
		return Object.keys(drumConfig)
	}, [instrument])

	const handleDrumActiveChange = (key: string) => {
		if (key.length) {
			player.triggerDrum(key)
		}
	}

	const { handler } = useBoardTouch(keys, setKeys, {
		onChange: handleDrumActiveChange,
	})
	const { keyHandler } = useDrumKeyDown(keys, setKeys, drumKeyList, {
		onChange: handleDrumActiveChange,
	})

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

	return (
		<div id="drum-board" className={cx(styles['drum-wrap'])} {...handler} {...keyHandler}>
			{drumKeyList.map((key) => (
				<div
					data-key={key}
					key={key}
					className={cx(
						styles['drum-item'],
						'touch-primary',
						'primary-button',
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