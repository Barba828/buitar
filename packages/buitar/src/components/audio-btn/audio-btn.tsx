import { FC, memo, useEffect, useState } from 'react'
import { Icon } from '@/components/icon'
import cx from 'classnames'
import * as Tone from 'tone'

import styles from './audio-btn.module.scss'
import { TonePlayer } from '@buitar/tone-player'
import { waitAudioContext } from '@/utils/audio-play'

/**
 * audioContext状态开关
 */
export const AudioBtn: FC = memo(() => {
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
		<div
			className={cx(
				// 'primary-button',
				styles['audio-btn'],
				!mute && styles['audio-btn__hidden']
			)}
			onClick={waitAudioContext}
		>
			<Icon name={mute ? 'icon-mute' : 'icon-volume'} />
		</div>
	)
})
