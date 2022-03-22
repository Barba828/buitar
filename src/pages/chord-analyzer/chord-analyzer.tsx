import React, { useEffect } from 'react'
import {
	GuitarBoard,
	ChordCard,
	BoardProvider,
	useBoardContext,
	getChordName,
	BoardController,
} from '@/components/guitar-board'
import { FifthsCircle } from '@/components/fifths-circle'
import cx from 'classnames'

import styles from './chord-analyzer.module.scss'
import { Point, Note, transChordType, ChordType } from 'to-guitar'

export const ChordAnalyzer = () => {
	return (
		<BoardProvider>
			<TapedGuitarBoard />
			<BoardController />

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

	const handleCheckedPoint = (point: Point) => {
		const checkedIndex = taps.indexOf(point)
		if (checkedIndex === -1) {
			const stringIndex = taps.findIndex((tap) => tap.string === point.string)
			if (stringIndex > -1) {
				taps.splice(stringIndex, 1)
			}
			setTaps([...taps, point])
		} else {
			taps.splice(checkedIndex, 1)
			setTaps([...taps])
		}
	}

	return <GuitarBoard onClickPoint={handleCheckedPoint} />
}

const TapedChordCard = () => {
	const { chordTaps, setChordTaps, boardOptions } = useBoardContext()

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

	let extra
	if (chordTaps?.chordType && chordTaps.chordType.length > 1) {
		extra = chordTaps.chordType.slice(1).map((chordType, index) => {
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
		extra.push(
			<div
				key="self"
				onClick={() => {}}
				className={cx('buitar-primary-button', styles['type-item'])}
			>
				自定义
			</div>
		)
	}
	return (
		<div className={styles['taped-container']}>
			{/* <FifthsCircle
				size={300}
				thin={50}
				className={cx('buitar-primary-button', styles['fifth-circle'])}
			/> */}
			<ChordCard size={200} className={styles['svg-chord']} />
			<div className={styles['type-list']}>{extra}</div>
		</div>
	)
}
