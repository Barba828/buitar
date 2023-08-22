import { FC, memo, useCallback, useEffect, useState } from 'react'
import { Icon } from '@/components/icon'
import cx from 'classnames'
import * as Tone from 'tone'

import styles from './audio-btn.module.scss'
import { TonePlayer } from '@buitar/tone-player'

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

	const toggleAudioContext = useCallback(async () => {
		const player = (window.tonePlayer as TonePlayer)?.getContext()
        player?.triggerAttackRelease('A2', '16n')
		
		await Tone.start()
	}, [])

	return (
		<div
			className={cx(
				// 'primary-button',
				styles['audio-btn'],
				!mute && styles['audio-btn__hidden']
			)}
			onClick={toggleAudioContext}
		>
			<Icon name={mute ? 'icon-mute' : 'icon-volume'} />
		</div>
	)
})
