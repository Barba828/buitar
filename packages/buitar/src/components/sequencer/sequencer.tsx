import {
	FC,
	forwardRef,
	memo,
	useCallback,
	useEffect,
	useImperativeHandle,
	useMemo,
	useRef,
} from 'react'
import * as Tone from 'tone'
import { Icon } from '@/components/icon'
import { useEditable } from './use-editable'
import { Switch } from '@/components/ui'
import { DrumPlayer, TonePlayer } from '@buitar/tone-player'
import { useSequencerContext } from './sequencer-provider'
import { InstrumentColor } from '@/pages/settings/config/controller.type'
import { useIsMobile } from '@/utils/hooks/use-device'
import { waitAudioContext } from '@/utils/audio-play'
import cx from 'classnames'

import styles from './sequencer.module.scss'

/**
 * 单序列active的音符
 * number[0] 为起始位置
 * number[1] 为结束位置
 * string 为状态
 */
export type Block = [number, number, ('translucent' | string)?]
/**
 * key: 音符
 * blocks: 单序列active的音符列表
 */
export type Sound = { key: string; blocks: Block[] }

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

export interface SequencerProps extends Pick<SequencerListProps, 'color'> {
	/**
	 * 播放列表
	 */
	sounds?: Sound[]
	/**
	 * 播放器
	 */
	player: TonePlayer | DrumPlayer
	/**
	 * 存在Controller
	 */
	controllable?: boolean
}

interface TonePart {
	/**
	 * time 格式为"bars:quarters:sixteenths" 分别对应小节、四分音符和十六分音符
	 * 实际上这对应4进制的 百十个 三位数字
	 */
	time: string
	key: Sound['key']
	duration: string
}

/**
 * 音序机
 */
export const Sequencer: FC<SequencerProps> = memo(({ sounds = defaultSounds, player, color }) => {
	const { m, isPlaying } = useSequencerContext()
	const sequencerList = useRef<SequencerListRefs>(null) // 音序条Ref
	const tonePart = useRef<Tone.Part<TonePart>>() // 当前组件循环播放ID

	/**
	 * Tone.Part 循环播放实现音序机Looper
	 * Tone.Loop 同步循环实现UI绘制
	 * player.triggerNote 播放
	 */
	useEffect(() => {
		tonePart.current?.clear()
		if (!isPlaying || !player.loaded) {
			return
		}

		// 音序机所有Sounds格子生成时间片List
		const partNotes: TonePart[] = []
		sounds.forEach((sound) => {
			const { key, blocks } = sound
			blocks.forEach((block) => {
				const time = block[0].toString(4).padStart(3, '0').split('').join(':')
				const duration = 16 / (block[1] - block[0] + 1) + 'n'
				partNotes.push({
					time,
					key,
					duration,
				})
			})
		})

		// 播放时间片
		tonePart.current = new Tone.Part((time, { key, duration }) => {
			player.triggerNote(key, duration, time)
		}, partNotes)
		// 循环
		tonePart.current.loop = true
		tonePart.current.loopEnd = `${m}m`

		const nowTime = Tone.Transport.seconds + 0.01
		const looper = new Tone.Loop((_time) => {
			sequencerList.current?.playTimeline(Tone.Transport.toSeconds(`${m}m`))
		}, `${m}m`).start(nowTime)

		tonePart?.current?.start(nowTime)
		return () => {
			looper.cancel()
			tonePart.current?.clear()
			Tone.Transport.cancel().stop()
		}
	}, [sounds, m, isPlaying])

	/**
	 * 音序条改变时提示
	 */
	const handleChange = useCallback((sound: Sound) => {
		player.loaded && player.triggerNote(String(sound.key))
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
	onRandom?(): void
}> = ({ editVisible = true, mVisible = true, onSave, onRandom, children }) => {
	const { isPlaying, setIsPlaying, editable, setEditable, bpm, setBpm, m, setM } =
		useSequencerContext()

	const isMobile = useIsMobile()

	/**
	 * 播放按钮
	 */
	const handlePlay = useCallback(async () => {
		await waitAudioContext()

		Tone.Transport.toggle()
		setIsPlaying(!isPlaying)
	}, [isPlaying])

	/**
	 * 小节数选择器
	 */
	const handleChangeM = useCallback(() => {
		const nextM = m === 1 ? 2 : m === 2 ? 4 : 1
		Tone.Transport.stop()
		setIsPlaying(false)
		setM(nextM)
	}, [m])

	return (
		<div className={styles['player-controller']}>
			<div className={cx('primary-button', styles['player-icon'])} onClick={handlePlay}>
				<Icon size={24} name={isPlaying ? 'icon-stop' : 'icon-play'} />
			</div>

			<div className={cx('primary-button', styles['player-range'])}>
				<span className={styles['player-range-text']}>
					{!isMobile && 'Tempo'}
					<span className={styles['player-range-bpm']}> {bpm} </span>
					bpm
				</span>
				<input
					type="range"
					onChange={(e) => {
						setBpm(Number(e.target.value))
					}}
					className="primary-range"
					min={30}
					max={240}
					step={1}
					defaultValue={bpm}
				/>
			</div>

			{editVisible && (
				<div className={cx('primary-button', styles['player-icon'])}>
					<Switch defaultValue={editable} onChange={setEditable} />
				</div>
			)}

			{mVisible && (
				<div className={cx('primary-button', styles['player-icon'])} onClick={handleChangeM}>
					<span className={styles['player-m']}> {m}m </span>
				</div>
			)}

			{onSave && (
				<div className={cx('primary-button', styles['player-icon'])} onClick={onSave}>
					<Icon size={24} name="icon-save" />
				</div>
			)}

			{onRandom && (
				<div className={cx('primary-button', styles['player-icon'])} onClick={onRandom}>
					<Icon size={24} name="icon-random"></Icon>
				</div>
			)}
			{children}
		</div>
	)
}

interface SequencerListProps {
	/**
	 * 播放List
	 */
	soundList: Sound[]
	/**
	 * 高亮按钮颜色
	 */
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
		const {
			isPlaying: timelineVisible,
			editable,
			panelData: { itemWidth, maxLength, headerItemWidth },
		} = useSequencerContext()

		const container = useRef<HTMLDivElement>(null)
		const timeline = useRef<HTMLDivElement>(null)

		const itemSizeX = 2 * Number(styles.sound_margin) + itemWidth // 格子宽度
		const itemSizeY = 2 * Number(styles.sound_margin) + Number(styles.sound_height) // 格子高度
		const headerItemSizeX = 2 * Number(styles.sound_margin) + headerItemWidth // 音符格子宽度
		const soundWidth = headerItemSizeX + itemSizeX * maxLength // 格子行总宽度

		/**
		 * 幽灵条设置 & 事件监听
		 */
		const { ghost, handler } = useEditable({
			itemSizeX,
			itemSizeY,
			headerItemSizeX,
			soundList,
			maxLength,
			container,
			editable,
			onChange,
		})
		/** 4分音符分割线 */
		const spacingLine = useMemo(() => {
			const length = Math.round(maxLength / 4) - 1 > 0 ? Math.round(maxLength / 4) - 1 : 0
			return new Array(length).fill(0).map((_, index) => {
				return (
					<div
						key={index}
						style={{
							left: headerItemSizeX + itemSizeX * 4 * (index + 1) - Number(styles.sound_margin),
						}}
						className={styles['sound-line']}
					></div>
				)
			})
		}, [maxLength, headerItemSizeX, itemSizeX])

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
						className={cx('primary-button', styles['sound-item'])}
						style={{ width: itemWidth, minWidth: itemWidth }}
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
									'primary-button',
									styles['sound-item'],
									styles['sound-item-active'],
									`touch-${color}`
									// `touch-yellow`
								)}
								style={{
									opacity: block[2] === 'translucent' ? 0.4 : 1,
									transform: `translateX(${block[0] * itemSizeX}px)`,
									width: itemSizeX * (block[1] - block[0]) + itemWidth,
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
							className={cx('primary-button', styles['sound-item'], styles['sound-item-ghost'])}
							style={{
								transform: `translateX(${ghost[1] * itemSizeX}px)`,
								width: itemSizeX * ghost[2] + itemWidth,
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
			timeline.current.style.left = `${headerItemSizeX}px`

			// 10ms 防止页面left未复原
			setTimeout(() => {
				if (!timeline.current) {
					return
				}
				timeline.current.style.transition = `left ${time}s linear`
				timeline.current.style.left = `${soundWidth}px`
			}, 10)
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
								className={cx('primary-button', styles['sound-item'], styles['sound-head'])}
								style={{ width: headerItemWidth }}
								onClick={() => onChange?.({ key, blocks: [] })}
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
				{spacingLine}
				<div
					ref={timeline}
					className={cx(styles['sound-time-line'], timelineVisible && styles['sound-time-visible'])}
				></div>
			</div>
		)
	}
)
