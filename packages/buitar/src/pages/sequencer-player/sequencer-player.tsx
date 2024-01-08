import { memo, useEffect, useState } from 'react'
import {
	Icon,
	Sequencer,
	SequencerController,
	SequencerProvider,
	PagesIntro,
	PagesMeta,
} from '@/components'
import { instrumentUIConfig } from '@/pages/settings/config/controller.config'
import type { Instrument } from '@buitar/tone-player/src/instrument.type'
import {
	SequencerReducerPayload,
	SequencerReducerType,
	setSequencersStateToStore,
	useSequencerReducer,
} from './use-sequencer-reducer'
import { useDebounce } from '@/utils/hooks/use-debouce'
import cx from 'classnames'

import styles from './sequencer-player.module.scss'

export const SequencerPlayer = memo(() => {
	const [sequencers, dispatchSequencers] = useSequencerReducer()

	return (
		<SequencerProvider>
			<PagesMeta />
			<PagesIntro />
			<SequencerController
				onSave={() => {
					setSequencersStateToStore(sequencers)
				}}
			/>
			{sequencers.map((sequencer, index) => {
				const { sequencerPlayer, sounds, color } = sequencer
				return (
					<div key={sequencer.sequencerPlayer.getInstrument() + index}>
						<Sequencer player={sequencerPlayer} color={color} sounds={sounds} />
						<SequencerOptionController
							defaultInstrument={sequencerPlayer.getInstrument()}
							onChange={(type, payload) => {
								dispatchSequencers({
									type,
									payload: {
										index,
										...payload,
									},
								})
							}}
						/>
					</div>
				)
			})}
			<div
				className={cx('primary-button', styles['add'])}
				onClick={() => {
					dispatchSequencers({
						type: 'add',
						payload: {
							index: sequencers.length,
						},
					})
				}}
			>
				<Icon name="icon-add" />
			</div>
		</SequencerProvider>
	)
})

const volumeRange = [-20, 20]

const SequencerOptionController = ({
	defaultInstrument = 'guitar-acoustic',
	onChange,
}: {
	defaultInstrument?: Instrument
	onChange?: (type: SequencerReducerType, payload?: Partial<SequencerReducerPayload>) => void
}) => {
	const [extend, setExtend] = useState(false)
	const [mute, setMute] = useState(false)
	const [volume, setVolume] = useState(0)
	const [checked, setChecked] = useState(defaultInstrument)
	const debounceVolume = useDebounce(volume, 100)

	useEffect(() => {
		setChecked(defaultInstrument)
	}, [defaultInstrument])

	useEffect(() => {
		if (mute) {
			setVolume(volumeRange[0])
		} else {
			setVolume(0)
		}
		onChange?.('mute', { turn: !mute })
	}, [mute])

	useEffect(() => {
		if (debounceVolume === volumeRange[0]) {
			setMute(true)
			return
		} else {
			setMute(false)
		}

		onChange?.('volume', { volume: debounceVolume })
	}, [debounceVolume])

	const pickerView = (Object.keys(instrumentUIConfig) as Instrument[]).map((instrument, index) => {
		const item = instrumentUIConfig[instrument]
		const extended = extend || instrument === checked
		return (
			<div
				key={index}
				className={cx(
					'primary-button',
					`touch-${item.color}`,
					styles['instrument-item'],
					!extended && styles['instrument-item-hidden']
				)}
				onClick={() => {
					if (instrument !== checked) {
						setChecked(instrument)
						onChange?.('instrument', { instrument })
					}
					setExtend(!extend)
				}}
			>
				{item.name_zh}
				{instrument === checked && !extend && <Icon name="icon-play" />}
			</div>
		)
	})

	return (
		<div className={styles['picker']}>
			{pickerView}
			<div className={cx('primary-button', styles['options-item'])}>
				<Icon
					onClick={() => {
						setMute(!mute)
					}}
					className={styles['options-item-icon']}
					name={mute ? 'icon-mute' : 'icon-volume'}
				/>
				<input
					type="range"
					onChange={(e) => {
						setVolume(Number(e.target.value))
					}}
					className={cx('primary-range', styles['options-item-input'])}
					min={volumeRange[0]}
					max={volumeRange[1]}
					step={1}
					value={volume}
				/>
				<span className={styles['options-item-span']}>{volume}</span>
			</div>
			<div
				className={cx('primary-button', styles['options-item'])}
				onClick={() => {
					onChange?.('delete')
				}}
			>
				<Icon name="icon-delete" />
			</div>
		</div>
	)
}
