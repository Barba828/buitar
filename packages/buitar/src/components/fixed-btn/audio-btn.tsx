import { FC, memo, useEffect, useState } from 'react'
import { Icon } from '@/components/icon'
import cx from 'classnames'
import * as Tone from 'tone'
import { TonePlayer } from '@buitar/tone-player'
import { waitAudioContext } from '@/utils/audio-play'

import styles from './audio-btn.module.scss'

/**
 * audioContext状态开关
 */
export const AudioBtn: FC<React.HTMLAttributes<HTMLButtonElement>> = memo((props) => {
	const [mute, setMute] = useState<Boolean>(Tone.context.state !== 'running')
    const context = (window.tonePlayer as TonePlayer).context || Tone.context

	useEffect(() => {
		context.on('statechange', (state) => {
			setMute(state !== 'running')
			console.log(
				'%c AudioContext ',
				'color:white; background:rgb(199, 156, 15);border-radius: 2px',
				state
			)
		})
	})

	return (
		<button
			className={cx(
				props.className,
				styles['audio-btn'],
				!mute && styles['audio-btn__hidden']
			)}
			onClick={waitAudioContext}
			id="audio-btn"
		>
			<Icon name={mute ? 'icon-mute' : 'icon-volume'} />
		</button>
	)
})
