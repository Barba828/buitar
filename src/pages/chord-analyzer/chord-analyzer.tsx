import React, { FC, useEffect, useState } from 'react'
import {
	GuitarBoard,
	ChordCard,
	BoardProvider,
	useBoardContext,
	getChordName,
	BoardController,
	DetialCard,
} from '@/components/guitar-board'
import { FifthsCircle } from '@/components/fifths-circle'
import { Point, Note, transChordType, ToneSchema, ChordType } from 'to-guitar'
import cx from 'classnames'

import styles from './chord-analyzer.module.scss'
import { Icon } from '@/components'

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

	const handleCheckedPoint = (points: Point[]) => {
		const point = points[0]
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

	return <GuitarBoard onCheckedPoints={handleCheckedPoint} />
}

const TapedChordCard = () => {
	const { taps, chordTaps, setChordTaps, boardOptions, setEmphasis, guitarBoardOption } =
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
			setEmphasis([])
			return
		}

		const emphasis: string[] = []
		guitarBoardOption.keyboard.forEach((string) => {
			string.forEach((point) => {
				if (point.toneSchema.note === tone.note) {
					emphasis.push(String(point.index))
				}
			})
		})
		setEmphasis(emphasis)
	}

	return (
		<div className={styles['taped-container']}>
			<FifthsCircle
				size={280}
				thin={70}
				minor={false}
				onClick={handleClickFifths}
				className={cx('buitar-primary-button', styles['fifth-circle'])}
			/>
			<ChordCard size={200} className={styles['svg-chord']} taps={taps} />
			<div>
				<DetialCard />
				<div className={styles['type-list']}>{extra}</div>
			</div>
		</div>
	)
}

const AddTextInput: FC<{ onConfirm?: (text: string) => void }> = ({ onConfirm }) => {
	const [isInput, setIsInput] = useState<boolean>(false)
	const [name, setName] = useState<string>('')

	const handleClick = () => {
		setIsInput(!isInput)
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setName(e.target.value)
	}

	const handleConfirm = () => {
		setIsInput(false)
		onConfirm?.(name)
	}

	const add = (
		<div onClick={handleClick} className={cx('buitar-primary-button', styles['type-item'])}>
			<Icon name="icon-add" />
		</div>
	)

	const input = (
		<>
			<input
				placeholder="C..."
				onChange={handleChange}
				className={cx('buitar-primary-button', styles['type-input'])}
			></input>
			<div className={cx(styles['type-input-controller'])}>
				<div
					onClick={handleClick}
					className={cx('buitar-primary-button', styles['type-input-item'])}
				>
					<Icon name="icon-back" size={12} />
				</div>
				<div
					onClick={handleConfirm}
					className={cx('buitar-primary-button', styles['type-input-item'])}
				>
					<Icon name="icon-confirm" size={14} />
				</div>
			</div>
		</>
	)
	return isInput ? input : add
}
