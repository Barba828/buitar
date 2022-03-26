import React, {
	FC,
	forwardRef,
	useCallback,
	useEffect,
	useImperativeHandle,
	useMemo,
	useRef,
	useState,
} from 'react'
import * as Tone from 'tone'
import { Icon } from '../icon'
import { useEditable } from './use-editable'
import cx from 'classnames'

import styles from './sequencer.module.scss'

/**
 * 单序列active的音符
 * number[0] 为起始位置
 * number[1] 为结束位置
 */
export type Block = [number, number]
/**
 * key: 音符
 * blocks: 单序列active的音符列表
 */
export type Sound = { key: Tone.Unit.Frequency; blocks: Block[] }

const defaultSounds: Sound[] = [
	{ key: 'C4', blocks: [] },
	{ key: 'B3', blocks: [] },
	{ key: 'A3', blocks: [] },
	{ key: 'G3', blocks: [] },
	{ key: 'F3', blocks: [] },
	{ key: 'E3', blocks: [] },
	{ key: 'D3', blocks: [] },
	{ key: 'C3', blocks: [] },
]

export interface SequencerProps {
	/**
	 * 播放列表
	 */
	sounds?: Sound[]
	/**
	 * 播放拍数
	 */
	m?: number
	/**
	 * 默认节拍
	 */
	bpm?: number
	/**
	 * 播放器
	 */
	player: {
		triggerAttackRelease: Tone.Sampler['triggerAttackRelease']
	}
	/**
	 * 可修改播放内容
	 */
	editable?: boolean
}

/**
 * 音序机
 */
export const Sequencer: FC<SequencerProps> = ({
	sounds = defaultSounds,
	player,
	m = 1,
	bpm = 60,
}) => {
	const [isPlaying, setIsPlaying] = useState(false)
	const [playerBpm, setPlayerBpm] = useState(bpm)
	const sequencerList = useRef<SequencerListRefs>(null)

	const maxLength = 16 * m // 16分音符数量

	// 十六分音符UI宽度
	const itemWidth = useMemo(() => {
		const containerWidth = document.getElementById('board')?.getBoundingClientRect().width
		if (!containerWidth) {
			return 0
		}
		return (containerWidth * 0.8 * 0.9) / maxLength
	}, [document.getElementById('board')?.getBoundingClientRect().width])

	useEffect(() => {
		Tone.Transport.bpm.value = playerBpm
		// 1秒内bpm平滑变动到...
		// Tone.Transport.bpm.rampTo(bpm, 1)
	}, [playerBpm])

	useEffect(() => {
		Tone.Transport.cancel().stop()
		Tone.Transport.scheduleRepeat((time) => {
			// 十六分音符时间长度
			const itemTime = Tone.Transport.toSeconds('16n')
			sounds.forEach((sound) => {
				const { key, blocks } = sound
				blocks.forEach((block) => {
					const start = block[0] * itemTime // 在一拍中的开始时间
					const duration = 16 / (block[1] - block[0] + 1) + 'n' //在一拍中的持续时间
					player.triggerAttackRelease(key, duration, time + start)
				})
			})
			Tone.Draw.schedule(() => {
				// 每次循环滚动时间线
				sequencerList.current?.playTimeline(Tone.Transport.toSeconds(`${m}m`))
			}, time)
		}, `${m}m`)
		return () => {
			Tone.Transport.cancel().stop()
		}
	}, [sounds])

	const handlePlay = useCallback(() => {
		if (isPlaying) {
			stop()
		} else {
			start()
		}
		setIsPlaying(!isPlaying)
	}, [isPlaying])

	const handleChange = useCallback((sound: Sound) => {
		player.triggerAttackRelease(sound.key, '2n')
	}, [])

	const start = useCallback(() => {
		Tone.start()
		Tone.Transport.start()
	}, [])

	const stop = useCallback(() => {
		Tone.Transport.stop()
	}, [])

	if (itemWidth === 0) {
		return null
	}

	return (
		<div>
			<div className={styles['player-controller']}>
				<div className={cx('buitar-primary-button', styles['player-icon'])} onClick={handlePlay}>
					<Icon size={24} name={isPlaying ? 'icon-stop' : 'icon-play'} />
				</div>
				<div
					className={cx('buitar-primary-button', styles['player-range'])}
					style={{ width: (itemWidth + 1) * 16 - 2 + 'px' }}
				>
					<span className={styles['player-range-text']}>
						Tempo
						<span className={styles['player-range-bpm']}> {playerBpm} </span>
						bpm
					</span>
					<input
						type="range"
						onChange={(e) => {
							setPlayerBpm(Number(e.target.value))
						}}
						min={30}
						max={240}
						step={1}
						defaultValue={playerBpm}
					/>
				</div>
			</div>
			<SequencerList
				ref={sequencerList}
				editable
				timelineVisible={isPlaying}
				soundList={sounds}
				maxLength={maxLength}
				itemWidth={itemWidth}
				onChange={handleChange}
			/>
		</div>
	)
}

interface SequencerListProps {
	soundList: Sound[]
	maxLength: number
	itemWidth: number
	editable?: boolean
	timelineVisible?: boolean
	onChange?: (sound: Sound) => void
}

interface SequencerListRefs {
	playTimeline: (time: number) => void
}

const SequencerList = forwardRef<SequencerListRefs, SequencerListProps>(
	({ soundList, maxLength, itemWidth, editable, timelineVisible, onChange }, ref) => {
		const container = useRef<HTMLDivElement>(null)
		const timeline = useRef<HTMLDivElement>(null)

		const itemSize = 2 * styles.sound_margin + itemWidth // 格子宽度
		const itemSizeY = 2 * styles.sound_margin + Number(styles.sound_height) // 格子高度
		const headSize = 2 * styles.sound_margin + Number(styles.button_size) // 音符格子宽度
		const soundSize = headSize + itemSize * maxLength // 格子行总宽度

		/**
		 * 幽灵条设置 & 事件监听
		 */
		const { ghost, dispatch } = useEditable({
			itemSize,
			itemSizeY,
			soundList,
			maxLength,
			container,
			editable,
			onChange,
		})

		/**
		 * 4分音符分割线
		 * @returns
		 */
		const spacingLine = () => {
			return new Array(Math.round(maxLength / 4) - 1).fill(0).map((_, index) => {
				return (
					<div
						key={index}
						style={{ left: headSize + itemSize * 4 * (index + 1) - Number(styles.sound_margin) }}
						className={styles['sound-line']}
					></div>
				)
			})
		}

		// 默认背景 Item
		const backgounrdItems = (keyIndex: number) => {
			const handleClick = () => {
				// 编辑模式下由useEditable.dispatch处理
				if (editable) {
					return
				}
				const key = soundList[keyIndex].key
				onChange?.({ key, blocks: [] })
			}
			return new Array(maxLength).fill(0).map((_i, index) => {
				return (
					<div
						key={index}
						data-sq={`${keyIndex}-${index}-empty`}
						className={cx('buitar-primary-button', styles['sound-item'])}
						style={{ width: itemWidth }}
						onClick={handleClick}
					></div>
				)
			})
		}

		// active Item & ghost Item
		const activedItemsBlock = (keyIndex: number, blocks: Block[]) => {
			const handleClick = () => {
				// 编辑模式下由useEditable.dispatch处理
				if (editable) {
					return
				}
				const key = soundList[keyIndex].key
				onChange?.({ key, blocks: blocks })
			}
			return (
				<>
					{blocks.map((block, index) => {
						return (
							<div
								key={`${block[0]}-${index}`}
								data-sq={`${keyIndex}-${index}-active`}
								className={cx(
									'buitar-primary-button',
									styles['sound-item'],
									styles['sound-item-active']
								)}
								style={{
									transform: `translateX(${block[0] * itemSize}px)`,
									width: itemSize * (block[1] - block[0]) + itemWidth,
								}}
								onClick={handleClick}
							>
								{editable && (
									<div
										data-sq={`${keyIndex}-${index}-handler`}
										className={styles['sound-item-handler']}
									>
										<div className={styles['sound-item-handler-view']} />
									</div>
								)}
							</div>
						)
					})}
					{editable && keyIndex === ghost[0] && (
						<div
							className={cx(
								'buitar-primary-button',
								styles['sound-item'],
								styles['sound-item-ghost']
							)}
							style={{
								transform: `translateX(${ghost[1] * itemSize}px)`,
								width: itemSize * ghost[2] + itemWidth,
							}}
						>
							<div data-sq={`${keyIndex}-ghost-handler`} className={styles['sound-item-handler']}>
								<div className={styles['sound-item-handler-view']} />
							</div>
						</div>
					)}
				</>
			)
		}

		useImperativeHandle(ref, () => ({
			playTimeline: playTimeline,
		}))

		// 控制样式播放时间线
		const playTimeline = (time: number) => {
			if (!timeline.current) {
				return
			}
			timeline.current.style.transition = ''
			timeline.current.style.left = `${headSize}px`

			setTimeout(() => {
				if (!timeline.current) {
					return
				}
				timeline.current.style.transition = `left ${time}s linear`
				timeline.current.style.left = `${soundSize}px`
			})
		}

		return (
			<div ref={container} {...dispatch} className={styles['sound-container']}>
				{soundList.map((sound, keyIndex) => {
					const { key, blocks } = sound
					return (
						<div className={styles['sound']} key={key} data-sound={key}>
							<div
								className={cx('buitar-primary-button', styles['sound-item'], styles['sound-head'])}
							>
								{key}
							</div>
							<div className={styles['sound-list']}>
								{backgounrdItems(keyIndex)}
								{activedItemsBlock(keyIndex, blocks)}
							</div>
						</div>
					)
				})}
				{spacingLine()}
				<div
					ref={timeline}
					className={cx(styles['sound-time-line'], timelineVisible && styles['sound-time-visible'])}
				></div>
			</div>
		)
	}
)
