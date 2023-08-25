import { useState, useEffect, useMemo } from 'react'
import {
	useConfigContext,
	useBoardContext,
	TabSwitch,
	Icon,
	BoardOptionsController,
	ToneModeController,
	GuitarBoard,
	ChordCard,
} from '@/components'
import {
	Point,
	ModeType,
	getModeRangeTaps,
	getModeFregTaps,
	transChord,
	transToneMode,
	transChordTaps,
	BoardChord,
} from '@buitar/to-guitar'
import cx from 'classnames'

import styles from './guitar-tableture.module.scss'
import { getBoardChordName } from '@/components/guitar-board/board-controller/chord-card/utils'
/**
 * 点击获取该位置的任一指型
 * @returns
 */
export const TapedGuitarBoardTableture = () => {
	const tabList = [
		{
			key: 'down',
			label: '下行',
		},
		{
			key: 'up',
			label: '上行',
		},
		{
			key: 'all',
			label: '全指板',
		},
	]
	const { menus, isMobileDevice } = useConfigContext()
	const { taps, setTaps, setHighFixedTaps, guitarBoardOption, boardOptions, guitar } =
		useBoardContext()
	const [tab, setTab] = useState(tabList[0]) // 是否上行音阶指型
	const [rootPoint, setRootPoint] = useState<Point>() // 根音
	const [locked, setLocked] = useState(false) // 锁定指板

	// 获取当前点击位的 主和弦 以及 关系大小调和弦
	const sameTapsFilter = (boardChord: BoardChord) =>
		boardChord.chordTaps.every((tap) => taps.includes(tap))
	const [chordOriginTaps, setChordOriginTaps] = useState<BoardChord[]>([])
	const [chordRelationalTaps, setChordRelationalTaps] = useState<BoardChord[]>([])
	const chordOriginFilterTap = useMemo(() => chordOriginTaps.filter(sameTapsFilter), [taps])
	const chordRelationalFilterTap = useMemo(() => chordRelationalTaps.filter(sameTapsFilter), [taps])
	const chordRenderList = useMemo(
		() => [
			{ list: chordOriginFilterTap, title: '指型和弦' },
			{ list: chordRelationalFilterTap, title: '关系和弦' },
		],
		[chordOriginFilterTap, chordRelationalFilterTap]
	)

	const handleCheckedPoint = (points: Point[]) => {
		if (locked) {
			return
		}
		if (!points) {
			return
		}

		const rootPoint = points[0]

		// 获取当前根音和弦 以及 关系大小调和弦
		const rootModeMajor = guitarBoardOption.mode?.includes('major')
		const relationalTone = transToneMode(rootPoint.toneSchema.note, rootModeMajor)
		const chordOrigin = transChord(rootPoint.toneSchema.note, rootModeMajor ? '' : 'm')
		const chordRelational = transChord(relationalTone.tone.note, rootModeMajor ? 'm' : '')
		const chordOriginTaps = chordOrigin ? transChordTaps(chordOrigin?.chord, guitarBoardOption) : []
		const chordRelationalTaps = chordRelational
			? transChordTaps(chordRelational?.chord, guitarBoardOption)
			: []
		setChordOriginTaps(chordOriginTaps)
		setChordRelationalTaps(chordRelationalTaps)

		setRootPoint(points[0])
	}

	const handleCheckedMode = (item: ModeType) => {
		guitar.setOptions({ mode: item })
	}

	// 监听变化，更改指型
	useEffect(() => {
		if (!rootPoint) {
			return
		}
		let taps = []
		if (tab.key === 'all') {
			// 获取range全指板的指型
			taps = getModeRangeTaps(rootPoint, {
				board: guitarBoardOption.keyboard,
				mode: guitarBoardOption.mode,
				range: [0, guitar.board.baseFret - 1],
				ignorePitch: false,
			})
		} else {
			// 获取改品位的上下行指型
			const fregTaps = getModeFregTaps(
				rootPoint,
				guitarBoardOption.keyboard,
				guitarBoardOption.mode
			)
			taps = tab.key === 'up' ? fregTaps.up : fregTaps.down
		}
		const highFixedTaps = taps.filter((tap) => tap.tone === rootPoint.tone)
		// 设置指位
		setTaps(taps)
		// 设置根音高亮
		setHighFixedTaps(highFixedTaps)
	}, [rootPoint, tab, guitarBoardOption.mode])

	useEffect(() => () => {
		setChordOriginTaps([])
		setChordRelationalTaps([])
		guitar.setOptions({ mode: 'major' })
	}, [])

	return (
		<>
			<ToneModeController mode={guitar.board.mode} onClick={handleCheckedMode} />
			<div className={cx(styles['tableture-tab-wrap'])}>
				<TabSwitch
					values={tabList}
					defaultValue={tabList[0]}
					onChange={(tab) => setTab(tab)}
					renderItem={(tab) => tab.label}
					className={cx(styles['tableture-tab'])}
				/>
				<div
					className={cx(
						'primary-button',
						styles['tableture-lock'],
						locked && styles['tableture-locked']
					)}
					onClick={() => setLocked(!locked)}
				>
					{locked ? <Icon name="icon-lock" /> : <Icon name="icon-unlock" />}
				</div>
			</div>
			<GuitarBoard onCheckedPoints={handleCheckedPoint} />

			{chordRenderList.map(
				({ list, title }) =>
					list.length > 0 && (
						<div className={cx(styles['tableture-chord-wrap'])} key={title}>
							<div className={cx(styles['tableture-chord-title'], 'primary-button')}>{title}</div>
							<div className={cx(styles['tableture-chord-list'], 'scroll-without-bar')}>
								{list.map((tapItem, index) => (
									<ChordCard
										key={index}
										size={isMobileDevice ? 80 : 120}
										taps={tapItem.chordTaps}
										title={getBoardChordName(tapItem.chordType, boardOptions)}
									/>
								))}
							</div>
						</div>
					)
			)}

			{menus.board_setting && <BoardOptionsController extendItem={false} />}
		</>
	)
}
