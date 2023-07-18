import React, {
	FC,
	forwardRef,
	memo,
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
import { Switch } from '../ui'
import { TonePlayer } from '@/utils'
import { useSequencerContext } from '.'
import { InstrumentColor } from '@/components/guitar-board/board-controller/option-controller/controller.config'

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
	 * 播放器
	 */
	player: TonePlayer
	/**
	 * 存在Controller
	 */
	controllable?: boolean

	color?: InstrumentColor
}

/**
 * 音序机
 */
export const Sequencer: FC<SequencerProps> = memo(({ sounds = defaultSounds, player, color }) => {
	const { setIsPlaying, m, isPlaying } = useSequencerContext()
	const sequencerList = useRef<SequencerListRefs>(null) // 音序条Ref
	const scheduleId = useRef<number>() // 当前组件循环播放ID

	/**
	 * sounds改变默认修改音序机重复内容
	 * scheduleId保存这个组件实例上一次的音序，并更新本次sounds生成的音序
	 * （不能直接Tone.Transport.clear，因为会导致其他音序机实例的内容被清除）
	 * Tone.Draw.schedule：Tone重复的动画interval函数
	 */
	useEffect(() => {
		if (!isPlaying) {
			return
		}
		scheduleId.current && Tone.Transport.clear(scheduleId.current)
		scheduleId.current = Tone.Transport.scheduleRepeat((time) => {
			// 十六分音符时间长度
			const itemTime = Tone.Transport.toSeconds('16n')
			sounds.forEach((sound) => {
				const { key, blocks } = sound
				blocks.forEach((block) => {
					const start = block[0] * itemTime // 在一拍中的开始时间
					const duration = 16 / (block[1] - block[0] + 1) + 'n' //在一拍中的持续时间
					player.loaded && player.getContext().triggerAttackRelease(key, duration, time + start)
				})
			})

			Tone.Draw.schedule(() => {
				// 每次循环滚动时间线
				setIsPlaying(true)
				sequencerList.current?.playTimeline(Tone.Transport.toSeconds(`${m}m`))
			}, time)
		}, `${m}m`)
		return () => {
			Tone.Transport.cancel().stop()
		}
	}, [sounds, m, isPlaying])

	/**
	 * 音序条改变时提示
	 */
	const handleChange = useCallback((sound: Sound) => {
		player.loaded && player.getContext().triggerAttackRelease(sound.key, '2n')
	}, [])

	return (
		<SequencerList ref={sequencerList} soundList={sounds} onChange={handleChange} color={color} />
	)
})

/**
 * 音序机控制器
 */
export const SequencerController: FC<{
	editVisible?: boolean
	mVisible?: boolean
	onSave?(): void
}> = ({ editVisible = true, mVisible = true, onSave }) => {
	const { isPlaying, setIsPlaying, editable, setEditable, bpm, setBpm, m, setM } =
		useSequencerContext()

	const handlePlay = useCallback(() => {
		Tone.Transport.toggle()
		setIsPlaying(!isPlaying)
	}, [isPlaying])

	const handleChangeM = useCallback(() => {
		const nextM = m === 1 ? 2 : m === 2 ? 4 : 1
		Tone.Transport.stop()
		setIsPlaying(false)
		setM(nextM)
	}, [m])

	return (
		<div className={styles['player-controller']}>
			<div className={cx('buitar-primary-button', styles['player-icon'])} onClick={handlePlay}>
				<Icon size={24} name={isPlaying ? 'icon-stop' : 'icon-play'} />
			</div>

			<div className={cx('buitar-primary-button', styles['player-range'])}>
				<span className={styles['player-range-text']}>
					Tempo
					<span className={styles['player-range-bpm']}> {bpm} </span>
					bpm
				</span>
				<input
					type="range"
					onChange={(e) => {
						setBpm(Number(e.target.value))
					}}
					className="buitar-primary-range"
					min={30}
					max={240}
					step={1}
					defaultValue={bpm}
				/>
			</div>

			{editVisible && (
				<div className={cx('buitar-primary-button', styles['player-icon'])}>
					<Switch defaultValue={editable} onChange={setEditable} />
				</div>
			)}

			{mVisible && (
				<div className={cx('buitar-primary-button', styles['player-icon'])} onClick={handleChangeM}>
					<span className={styles['player-m']}> {m}m </span>
				</div>
			)}

			{onSave && (
				<div className={cx('buitar-primary-button', styles['player-icon'])} onClick={onSave}>
					<Icon size={24} name="icon-save" />
				</div>
			)}
		</div>
	)
}

interface SequencerListProps {
	soundList: Sound[]
	color?: InstrumentColor
	onChange?: (sound: Sound) => void
}

interface SequencerListRefs {
	playTimeline: (time: number) => void
}

/**
 * 音序条列表
 */
const SequencerList = forwardRef<SequencerListRefs, SequencerListProps>(
	({ soundList, color = 'yellow', onChange }, ref) => {
		const { isPlaying: timelineVisible, editable, itemWidth, maxLength } = useSequencerContext()

		const container = useRef<HTMLDivElement>(null)
		const timeline = useRef<HTMLDivElement>(null)

		const itemSize = 2 * styles.sound_margin + itemWidth // 格子宽度
		const itemSizeY = 2 * styles.sound_margin + Number(styles.sound_height) // 格子高度
		const headSize = 2 * styles.sound_margin + Number(styles.button_size) // 音符格子宽度
		const soundSize = headSize + itemSize * maxLength // 格子行总宽度

		/**
		 * 幽灵条设置 & 事件监听
		 */
		const { ghost, handler } = useEditable({
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
			const length = Math.round(maxLength / 4) - 1 > 0 ? Math.round(maxLength / 4) - 1 : 0
			return new Array(length).fill(0).map((_, index) => {
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
									styles['sound-item-active'],
									`touch-${color}`
									// `touch-yellow`
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

		if (itemWidth === 0 || itemWidth == Infinity) {
			return null
		}

		return (
			<div ref={container} {...handler} className={styles['sound-container']}>
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
