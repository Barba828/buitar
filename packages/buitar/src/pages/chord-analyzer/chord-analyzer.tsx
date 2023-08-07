import React, { useEffect } from 'react'
import {
	GuitarBoard,
	ChordCard,
	BoardProvider,
	useBoardContext,
	getChordName,
	BoardController,
	DetailCard,
} from '@/components/guitar-board'
import { FifthsCircle } from '@/components/fifths-circle'
import { Point, Note, transChordType, ToneSchema, ChordType } from '@buitar/to-guitar'
import { AddTextInput } from '@/components/basic'
import { usePagesIntro } from '@/components'
import { useIsMobile } from '@/utils/hooks/use-device'

import cx from 'classnames'

import styles from './chord-analyzer.module.scss'

export const ChordAnalyzer = () => {
	const intro = usePagesIntro()

	return (
		<BoardProvider>
			{intro}
			<BoardController extendItem={false}/>
			<TapedGuitarBoard />
			<TapedChordCard />
		</BoardProvider>
	)
}

const TapedGuitarBoard = () => {
	const { taps, setTaps, setChordTaps } = useBoardContext()

	useEffect(() => {
		const notes = taps
			.sort((a, b) => a.index - b.index)
			.map((tap) => tap.toneSchema.note)
			.reduce((pre: Note[], cur) => (pre.includes(cur) ? pre : [...pre, cur]), [])
		const chords = transChordType(notes)
		setChordTaps({ chordType: chords, chordList: [] })
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

const TapedChordCard = () => {
	const isMobile = useIsMobile()
	const { taps, chordTaps, setChordTaps, boardOptions, setFixedTaps, guitarBoardOption } =
		useBoardContext()

	const changeChordTapName = (index: number) => {
		if (!chordTaps?.chordType) {
			return
		}
		const chordType = [...chordTaps.chordType]
		const temp = chordType[0]
		chordType[0] = chordType[index]
		chordType[index] = temp
		setChordTaps({ ...chordTaps, chordType })
	}

	const addChordTapName = (name: string) => {
		let type: ChordType = {
			tag: '*',
			name: name,
			name_zh: '',
		}
		if (chordTaps?.chordType) {
			type = { ...chordTaps.chordType[0], ...type }
		} else if (taps) {
			const tone = taps.sort((a, b) => a.index - b.index)[0].toneSchema
			type.tone = tone
		}

		setChordTaps({
			chordList: [],
			chordType: chordTaps?.chordType ? [type, ...chordTaps?.chordType] : [type],
		})
	}

	/**
	 * 设置和弦多名称展示
	 */
	const extra: JSX.Element[] = []
	if (chordTaps?.chordType && chordTaps.chordType.length > 1) {
		const names = chordTaps.chordType.slice(1).map((chordType, index) => {
			return (
				<div
					onClick={() => {
						changeChordTapName(index + 1)
					}}
					key={index}
					className={cx('buitar-primary-button', styles['type-item'])}
				>
					{getChordName(chordType, boardOptions)}
				</div>
			)
		})
		extra.push(...names)
	}

	extra.push(<AddTextInput key="add-text-input" onConfirm={addChordTapName} />)

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
			{!isMobile && <FifthsCircle
				size={280}
				thin={70}
				minor={false}
				onClick={handleClickFifths}
				className={cx('buitar-primary-button', styles['fifth-circle'])}
			/>}
			<ChordCard size={isMobile ? 160 : 200} className={styles['svg-chord']} taps={taps} />
			<div>
				<DetailCard />
				<div className={styles['type-list']}>{extra}</div>
			</div>
		</div>
	)
}
