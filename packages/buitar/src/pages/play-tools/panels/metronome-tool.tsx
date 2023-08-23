import { FC, useEffect, useRef, useState } from 'react'
import * as Tone from 'tone'
import { RangeSlider, RadioSelector } from '@/components/ui'
import { Icon } from '@/components/icon'
import { waitAudioContext } from '@/utils/audio-play'
import { useDrumBoardContext } from '@/components/drum-board/drum-provider'
import cx from 'classnames'
import toolsStyles from '../play-tools.module.scss'
import styles from './metronome-tool.module.scss'

export const Metronome: FC = () => {
	const { player, instrument } = useDrumBoardContext()
	const [metronomeBeat, setMetronomeBeat] = useState(4) // 拍子
	const [metronomeNote, setMetronomeNote] = useState(4) // 小节
	const [metronomeBpm, setMetronomeBpm] = useState(60) // 拍速
	const [metronomeUpList, setMetronomeUpList] = useState([true, false, false, false]) // 重拍，默认第一拍是重拍
	const [beatIndex, setBeatIndex] = useState<number>(-1) // 当前高亮beat
	const [isPlaying, setIsPlaying] = useState(false)
	const id = useRef<number>(-1)

	let beat = 0

	useEffect(() => {
		player.dispatchInstrument('metronome')
		return () => {
			// 销毁页面重置drum
			player.dispatchInstrument(instrument || 'drum')
		}
	}, [])

	useEffect(() => {
		Tone.Transport.bpm.value = metronomeBpm // 设置节拍速度为每分钟60拍
	}, [metronomeBpm])

	useEffect(() => {
		// 更新 MetronomeItem 长度
		metronomeUpList.length = metronomeBeat
		setMetronomeUpList([...metronomeUpList])
	}, [metronomeBeat])

	useEffect(() => {
		Tone.Transport.timeSignature = [metronomeBeat, metronomeNote]
		Tone.Transport.clear(id.current)
		updateMetronomeLooper()
	}, [metronomeNote, metronomeBeat, metronomeUpList])

	const handleClickMetronome = (_up: boolean, index: number) => {
		metronomeUpList[index] = !metronomeUpList[index]
		setMetronomeUpList([...metronomeUpList])
	}

	/**更新 Tone.Transport.scheduleRepeat 轮播 */
	const updateMetronomeLooper = () => {
		const time = `${metronomeNote}n` // '4n'

		id.current = Tone.Transport.scheduleRepeat((time) => {
			const nowBeatIndex = beat % metronomeBeat
			setBeatIndex(nowBeatIndex)

			if (metronomeUpList[nowBeatIndex]) {
				player.triggerDrum('MetronomeUp', time)
			} else {
				player.triggerDrum('Metronome', time)
			}
			beat++
		}, time)
	}

	const clearMetronomeLooper = () => {
		Tone.Transport.stop()
		Tone.Transport.cancel()
		Tone.Transport.clear(id.current)
		beat = 0
		setBeatIndex(-1)
	}

	const play = async () => {
		await waitAudioContext()

		setIsPlaying(true)
		clearMetronomeLooper()
		updateMetronomeLooper()

		Tone.Transport.start()
	}

	const pause = () => {
		setIsPlaying(false)
		clearMetronomeLooper()
	}

	return (
		<div>
			<div className={toolsStyles['intro-title']}>Metronome</div>

			<div className={styles['metronome-option']}>
				<div className={cx('primary-button', styles['metronome-option-item'])}>Note</div>
				<RadioSelector
					values={[1, 2, 4, 8, 16]}
					defaultValue={metronomeNote}
					onChange={(val) => setMetronomeNote(val)}
				/>
			</div>
			<div className={styles['metronome-option']}>
				<div className={cx('primary-button', styles['metronome-option-item'])}>Beat</div>
				<RadioSelector
					values={new Array(16).fill(null).map((_, index) => index + 1)}
					defaultValue={metronomeBeat}
					onChange={(val) => setMetronomeBeat(val)}
				/>
			</div>
			<div className={styles['metronome-option']}>
				<div className={cx('primary-button', styles['metronome-option-item'])}>Bpm</div>
				<RangeSlider
					range={[30, 180]}
					defaultValue={metronomeBpm}
					step={1}
					onChange={([val]) => setMetronomeBpm(val)}
					className={styles['metronome-option__slider']}
				/>
			</div>

			<div className={styles['metronome-info']}>
				<div className={cx('primary-button', styles['metronome-info-item'])}>
					{' '}
					Tempo {metronomeBpm}{' '}
				</div>
				<div className={cx('primary-button', styles['metronome-info-item'])}>
					{metronomeBeat} / {metronomeNote}
				</div>
			</div>

			<div className={styles['metronome-wrap']}>
				{metronomeUpList.map((up, index) => (
					<div
						key={index}
						onClick={() => handleClickMetronome(up, index)}
						className={cx(
							'primary-button',
							styles['metronome-item'],
							up && styles['metronome-item__up'],
							beatIndex === index && 'touch-yellow'
						)}
					/>
				))}
			</div>

			{isPlaying ? (
				<div
					onClick={pause}
					className={cx('primary-button', 'touch-yellow', styles['metronome-btn'])}
				>
					<Icon name="icon-stop" />
				</div>
			) : (
				<div onClick={play} className={cx('primary-button', styles['metronome-btn'])}>
					<Icon name="icon-play" />
				</div>
			)}
		</div>
	)
}
