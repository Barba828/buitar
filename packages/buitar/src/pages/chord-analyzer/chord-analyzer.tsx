import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { GuitarBoard, ChordCard, useBoardContext, DetailCard } from '@/components/guitar-board'
import { FifthsCircle } from '@/components/fifths-circle'
import type { Point, ToneSchema, ChordType } from '@buitar/to-guitar'
import { pitchToChordType } from '@buitar/to-guitar'
import { AddTextInput } from '@/components/basic'
import { VexChord } from '@/components/svg-chord'
import { PagesMeta } from '@/components'
import { useIsMobile } from '@/utils/hooks/use-device'
import { getBoardChordName } from '@/components/guitar-board/board-controller/chord-card/utils'
import cx from 'classnames'

import styles from './chord-analyzer.module.scss'
import { useLocation } from 'react-router-dom'

export const ChordAnalyzer = () => {
	const [chordTypes, setChordTypes] = useState<ChordType[]>([])
	const { clearTaps, setTaps } = useBoardContext()
	const { state } = useLocation()

	useEffect(() => {
		// 初始化 来自路由参数的taps
		if (state && state.taps) {
			setTaps(state.taps)
		}
	}, [state])

	useEffect(() => () => clearTaps(), [])

	const handleChangeTaps = useCallback((taps: Point[]) => {
		const pitchs = taps.sort((a, b) => a.pitch - b.pitch).map((tap) => tap.pitch % 12)
		const chordTypes = pitchToChordType(Array.from(new Set(pitchs)))
		setChordTypes(chordTypes)
	}, [])
	return (
		<>
			<PagesMeta />
			<TapedGuitarBoard onChange={handleChangeTaps} />
			<TapedChordCard chordTypes={chordTypes} />
		</>
	)
}

const TapedGuitarBoard: FC<{ onChange?(taps: Point[]): void }> = ({ onChange }) => {
	const { taps, setTaps } = useBoardContext()

	useEffect(() => {
		onChange?.(taps)
	}, [taps])

	/**
	 * 选择 point 加入指板按键
	 * @param points
	 */
	const handleCheckedPoint = (points: Point[]) => {
		const point = points[0]
		const checkedIndex = taps.indexOf(point)
		if (checkedIndex === -1) {
			// 新增按键（如果该弦上已有其他品已按，则改为新按键）
			const stringIndex = taps.findIndex((tap) => tap.string === point.string)
			if (stringIndex > -1) {
				taps.splice(stringIndex, 1)
			}
			setTaps([...taps, point])
		} else {
			// 已选 -> 移除该按键
			taps.splice(checkedIndex, 1)
			setTaps([...taps])
		}
	}

	return <GuitarBoard onCheckedPoints={handleCheckedPoint} />
}

const TapedChordCard: FC<{ chordTypes: ChordType[] }> = ({ chordTypes: defaultChordTypes }) => {
	const isMobile = useIsMobile()
	const { taps, guitar, boardSettings, setFixedTaps, guitarBoardOption } = useBoardContext()
	const [chordTypes, setChordTypes] = useState(defaultChordTypes)

	useEffect(() => {
		setChordTypes([...defaultChordTypes])
	}, [defaultChordTypes])

	const checkedChordType = useMemo(() => chordTypes[0], [chordTypes])
	const extraChordTypes = useMemo(() => chordTypes.slice(1), [chordTypes])
	const title = useMemo(() => getBoardChordName(checkedChordType, guitarBoardOption), [checkedChordType, boardSettings])

	const changeChordTapName = (index: number) => {
		if (!chordTypes.length) {
			return
		}
		const temp = { ...chordTypes[0] }
		chordTypes[0] = chordTypes[index]
		chordTypes[index] = temp

		setChordTypes([...chordTypes])
	}

	/**新增自定义Chord详情 */
	const addChordTapName = (name: string) => {
		const type: ChordType = {
			...checkedChordType,
			tag: '*',
			name: name,
			name_zh: '',
		}
		// 获取最低根音
		if (taps) {
			const tone = taps.sort((a, b) => a.pitch - b.pitch)[0].tone
			type.tone = tone
		}
		setChordTypes([...chordTypes, type])
	}

	/**
	 * 根据五度圈，设置指板强调按钮
	 * @param tone
	 * @returns
	 */
	const handleClickFifths = ({ tone }: { tone?: ToneSchema }) => {
		if (!guitarBoardOption.keyboard) {
			return
		}
		if (!tone) {
			setFixedTaps([])
			return
		}

		guitar.setOptions({ scale: tone.note })
		
		const fixedTaps: Point[] = []
		guitarBoardOption.keyboard.forEach((string) => {
			string.forEach((point) => {
				if (point.tone === tone.index) {
					fixedTaps.push(point)
				}
			})
		})
		setFixedTaps(fixedTaps)
	}

	return (
		<div className={cx(styles['taped-container'], 'scroll-without-bar')}>
			{/* 五度圈 */}
			<FifthsCircle
				size={280}
				thin={50}
				onClick={handleClickFifths}
				className={cx('primary-button', styles['fifth-circle'])}
			/>
			{/* 和弦大图卡片 */}
			<ChordCard size={isMobile ? 120 : 160} className={styles['svg-chord']} taps={taps} title={title} />
			{/* 五线音阶卡片 */}
			<VexChord taps={taps} className={styles['vex-chord']} />
			{/* 和弦详细信息 */}
			<div>
				<DetailCard chordType={checkedChordType} />
				<div className={styles['type-list']}>
					{/* 和弦其他over转位和弦信息 */}
					{extraChordTypes.length > 0 &&
						extraChordTypes.map((chordType, index) => (
							<div
								onClick={() => {
									changeChordTapName(index + 1)
								}}
								key={index}
								className={cx('primary-button', styles['type-item'])}
							>
								{getBoardChordName(chordType, guitarBoardOption)}
							</div>
						))}
					<AddTextInput key="add-text-input" onConfirm={addChordTapName} />
				</div>
			</div>
		</div>
	)
}
