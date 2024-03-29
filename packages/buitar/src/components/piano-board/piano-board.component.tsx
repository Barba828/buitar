import React, { FC, useEffect, useRef, useState } from 'react'
import { NOTE_LIST } from '@buitar/to-guitar'
import cx from 'classnames'
import { TonePlayer } from '@buitar/tone-player'
import { useBoardTouch, usePianoKeyDown } from '@/utils/hooks/use-board-event'
import { useDebounce } from '@/utils/hooks/use-debouce'

import styles from './piano-board.module.scss'

interface PianoBoardProps
	extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	player: TonePlayer
	levels?: number[]
	checked?: string[]
	defaultTouched?: string[]
	onChangeKey?: (checked: string[]) => void
	onChangePart?: (level: boolean) => void
	disableKeydown?: boolean
}

export const PianoBoard: FC<PianoBoardProps> = ({
	player,
	levels = [2, 3, 4, 5],
	checked = [],
	defaultTouched = [],
	onChangeKey,
	onChangePart,
	...divProps
}) => {
	const [touched, setTouched] = useState<string[]>(defaultTouched)
	const scrollRef = useRef<HTMLDivElement>(null)
	const handleChangeKey = (key: string) => {
		if (key.length) {
			player.getContext().triggerAttackRelease(key, '2n')
		}
	}
	// 鼠标事件
	const { handler } = useBoardTouch(touched, setTouched, { onChange: handleChangeKey })
	// 按钮事件
	const { part, keyHandler } = usePianoKeyDown(touched, setTouched, { onChange: handleChangeKey })
	// 滚轮事件监听
	// useBoardWheel(scrollRef.current) // 水平滚动与触摸板逻辑冲突

	const debouceTouched = useDebounce(touched, 30)
	useEffect(() => {
		if (debouceTouched.length <= 0) {
			return
		}
		console.log(
			'%c Tones ',
			'color:white; background:rgb(62, 148, 202);border-radius: 2px',
			debouceTouched
		)

		onChangeKey?.(debouceTouched)
	}, [debouceTouched])

	useEffect(() => {
		onChangePart?.(part)
	}, [part])

	return (
		<div id="piano-board" className="scroll-without-bar" {...divProps} ref={scrollRef}>
			<div className={styles.piano} {...handler} {...keyHandler}>
				{levels.map((level, index) => (
					<PianoKeys key={index} level={level} touched={touched} checked={checked} />
				))}
			</div>
		</div>
	)
}

const PianoKeys: FC<{ level: number; touched: string[]; checked: string[] }> = ({
	level,
	touched,
	checked,
}) => {
	return (
		<>
			{NOTE_LIST.map((note) => {
				const noteClass = note.includes('#') ? styles.sharp : styles.flat
				const dataKey = `${note}${level}`
				return (
					<div
						key={note}
						className={cx(
							styles.key,
							noteClass,
							touched.includes(dataKey) && styles.touched,
							checked.includes(dataKey) && styles.checked
						)}
						data-key={dataKey}
					>
						{note === 'C' && dataKey}
					</div>
				)
			})}
		</>
	)
}
