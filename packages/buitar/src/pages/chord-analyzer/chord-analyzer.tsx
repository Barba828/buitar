import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import {
	GuitarBoard,
	ChordCard,
	useBoardContext,
	BoardController,
	DetailCard,
	BoardOptionsController,
} from '@/components/guitar-board'
import { FifthsCircle } from '@/components/fifths-circle'
import type { Point, Note, ToneSchema, ChordType } from '@buitar/to-guitar'
import { transChordType } from '@buitar/to-guitar'
import { AddTextInput } from '@/components/basic'
import { useMenuContext, usePagesIntro } from '@/components'
import { useIsMobile } from '@/utils/hooks/use-device'
import { getBoardChordName } from '@/components/guitar-board/board-controller/chord-card/utils'
import cx from 'classnames'

import styles from './chord-analyzer.module.scss'

export const ChordAnalyzer = () => {
	const intro = usePagesIntro()
	const [chordTypes, setChordTypes] = useState<ChordType[]>([])
	const { menus } = useMenuContext()

	const handleChangeTaps = useCallback((taps: Point[]) => {
		const notes = taps
			.sort((a, b) => a.pitch - b.pitch)
			.map((tap) => tap.toneSchema.note)
			.reduce((pre: Note[], cur) => (pre.includes(cur) ? pre : [...pre, cur]), [])
		const chordTypes = transChordType(notes)
		setChordTypes(chordTypes)
	}, [])

	return (
		<>
			{intro}
			{menus.board_setting && <BoardOptionsController extendItem={false}/>}
			<TapedGuitarBoard onChange={handleChangeTaps} />
			{chordTypes && <TapedChordCard chordTypes={chordTypes} />}
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
	const { taps, boardOptions, setFixedTaps, guitarBoardOption } = useBoardContext()
	const [chordTypes, setChordTypes] = useState(defaultChordTypes)

	useEffect(() => {
		setChordTypes([...defaultChordTypes])
	}, [defaultChordTypes])

	const checkedChordType = useMemo(() => chordTypes[0], [chordTypes])
	const extraChordTypes = useMemo(() => chordTypes.slice(1), [chordTypes])
	const title = useMemo(
		() => getBoardChordName(checkedChordType, boardOptions),
		[checkedChordType, boardOptions]
	)

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
			const tone = taps.sort((a, b) => a.index - b.index)[0].toneSchema
			type.tone = tone
		}
		setChordTypes([...chordTypes, type])
	}

	/**
	 * 根据五度圈，设置指板强调按钮
	 * @param tone
	 * @returns
	 */
	const handleClickFifths = ({ tone }: { tone: ToneSchema }) => {
		if (!guitarBoardOption.keyboard) {
			return
		}
		if (!tone) {
			setFixedTaps([])
			return
		}

		const fixedTaps: Point[] = []
		guitarBoardOption.keyboard.forEach((string) => {
			string.forEach((point) => {
				if (point.toneSchema.note === tone.note) {
					fixedTaps.push(point)
				}
			})
		})
		setFixedTaps(fixedTaps)
	}

	return (
		<div className={styles['taped-container']}>
			{/* 五度圈 */}
			{!isMobile && (
				<FifthsCircle
					size={280}
					thin={70}
					minor={false}
					onClick={handleClickFifths}
					className={cx('buitar-primary-button', styles['fifth-circle'])}
				/>
			)}
			{/* 和弦大图卡片 */}
			<ChordCard
				size={isMobile ? 160 : 200}
				className={styles['svg-chord']}
				taps={taps}
				title={title}
			/>
			<div>
				{/* 和弦详细信息 */}
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
								className={cx('buitar-primary-button', styles['type-item'])}
							>
								{getBoardChordName(chordType, boardOptions)}
							</div>
						))}
					<AddTextInput key="add-text-input" onConfirm={addChordTapName} />
				</div>
			</div>
		</div>
	)
}
