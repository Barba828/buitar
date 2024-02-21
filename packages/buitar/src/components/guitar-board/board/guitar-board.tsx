import { FC, useCallback, useEffect, useMemo, useRef } from 'react'
import type { Point } from '@buitar/to-guitar'
import { useBoardContext } from '../board-provider'
import { getPointNoteBySetting } from '../utils'
import { useBoardTouch, useGuitarKeyDown } from '@/utils/hooks/use-board-event'
import { useDebounce } from '@/utils/hooks/use-debouce'
import { Icon } from '@/components'
import { useIsTouch } from '@/utils/hooks/use-device'

import cx from 'classnames'
import styles from './guitar-board.module.scss'
import fretStyles from './guitar-board-fret.module.scss'

interface GuitarBoardProps {
	/**渲染吉他品数范围 */
	range?: [number, number]
	/**渲染吉他品数范围 */
	autoScroll?: boolean
	/**
	 * 选中指位 callback
	 * @param points
	 * @returns
	 */
	onCheckedPoints?: (points: Point[]) => void
	/**
	 * 键盘切换监听范围
	 * @param part
	 * @returns
	 */
	onChangePart?: (part: boolean) => void
}

const FRET_DOT = [, , '·', , '·', , '·', , '·', , , '··', , , , '·']

export const GuitarBoard: FC<GuitarBoardProps> = ({
	range = [1, 16],
	autoScroll = true,
	onCheckedPoints,
	onChangePart,
}) => {
	const {
		guitarBoardOption: { keyboard, baseFret },
		boardSettings: { isStickyZero = true },
		boardTheme,
		taps,
		emphasis,
		setEmphasis,
		player,
	} = useBoardContext()
	const boardRange = range[0] < 1 ? [1, range[1]] : range
	const scrollRef = useRef<HTMLDivElement>(null)
	const gradeRef = useRef<HTMLUListElement>(null)
	const scrollToGrade = useRef<number>(0)
	const BoardBtnComponent = boardTheme === 'default' ? BoardButtonOriginal : BoardButton
	const isTouchDevice = useIsTouch()

	/**扁平化指板二维数组 */
	const boardList = useMemo(() => {
		if (!keyboard) {
			return null
		}
		return exchangeBoardList(keyboard)
	}, [keyboard])
	/**指板点击事件回调 */
	const handleChangeKey = useCallback(
		(key: string) => {
			if (key.length && boardList) {
				const point = boardList[Number(key)]
				player.triggerPointRelease(point)
			}
		},
		[boardList]
	)
	// touchable设备：点击 checked
	const handleTouchKey = (key: string) => {
		if (key.length && boardList) {
			if (key.length && boardList && isTouchDevice) {
				const point = boardList[Number(key)]
				console.log('%c Point ', 'color:white; background:rgb(57, 167, 150);border-radius: 2px', point)
				onCheckedPoints?.([point])
			}
		}
	}

	// 鼠标事件监听
	const { handler } = useBoardTouch(emphasis, setEmphasis, {
		onChange: handleChangeKey,
		onClick: handleTouchKey,
	})
	// 键盘事件监听
	const { part, keyHandler } = useGuitarKeyDown(emphasis, setEmphasis, {
		gradeLength: baseFret,
		onChange: handleChangeKey,
	})
	// 滚轮事件监听
	// useBoardWheel(scrollRef.current) // 水平滚动与触摸板逻辑冲突

	// 非touchable设备：指位停留 30 ms以上(for拖拽多选) => play & checked
	const debouceEmphasis = useDebounce(emphasis, 30)
	useEffect(() => {
		if (debouceEmphasis.length <= 0 || !boardList) {
			return
		}
		const points = debouceEmphasis.map((index) => boardList[Number(index)])
		console.log('%c Points ', 'color:white; background:rgb(57, 167, 150);border-radius: 2px', points)
		onCheckedPoints?.(points)
	}, [debouceEmphasis])

	// 监听按键切换区域
	useEffect(() => {
		onChangePart?.(part)
	}, [part])

	// 监听指位改变
	useEffect(() => {
		if (!taps.length) {
			return
		}

		// 最低品改变，则滚动到指位的最低品（除0品外）
		const fisrtTapGrade = taps.filter((tap) => tap.grade !== 0).sort((a, b) => a.grade - b.grade)[0].grade
		if (fisrtTapGrade !== scrollToGrade.current) {
			const gradeWidth = gradeRef.current?.clientWidth
			if (gradeWidth && autoScroll) {
				scrollRef.current?.scrollTo({
					left: (fisrtTapGrade - 2) * gradeWidth,
					behavior: 'smooth',
				})
			}
			scrollToGrade.current = fisrtTapGrade
		}
	}, [taps])

	/**
	 * 播放所有弦音
	 */
	const handlePlayArpeggio = useCallback(() => {
		player.triggerPointArpeggio(taps)
	}, [taps])

	if (!keyboard) {
		return null
	}

	const board = exchangeBoardArray(keyboard)

	const boardView = board.slice(boardRange[0], boardRange[1] + 1).map((frets, fretIndex) => {
		const fretsView = frets.reverse().map((point, stringIndex) => <BoardBtnComponent key={stringIndex} point={point} />)

		const dotsView = <BoardDots index={fretIndex + boardRange[0]} fretDot={boardTheme !== 'default'} />
		return (
			<ul ref={gradeRef} className={cx(styles.frets)} key={fretIndex}>
				{fretsView}
				{dotsView}
			</ul>
		)
	})

	const zeroView = board.slice(0, 1).map((frets, fretIndex) => {
		const fretsView = frets.reverse().map((point, stringIndex) => <BoardBtnComponent key={stringIndex} point={point} />)

		// 播放按钮
		const playButton = (
			<div onClick={handlePlayArpeggio} className={cx('primary-button', styles['frets-dot'], styles['point'])}>
				<Icon name="icon-eighth-note" color="#fff8" size={16} />
			</div>
		)
		return (
			<ul className={cx(styles.frets, styles['frets-zero'])} key={fretIndex}>
				{fretsView}
				{playButton}
			</ul>
		)
	})

	return (
		<div
			id="fret-board"
			className={cx(styles.board, boardTheme !== 'default' && fretStyles['board'])}
			{...handler}
			{...keyHandler}
		>
			{isStickyZero && <div className={styles['board-view']}>{zeroView}</div>}
			<div ref={scrollRef} className={'scroll-without-bar'}>
				<div className={styles['board-view']}>
					{!isStickyZero && zeroView}
					{boardView}
				</div>
			</div>
		</div>
	)
}

/**
 * 风格化 keyboard button
 */
const BoardButton = ({
	point,
	itemClassName,
}: {
	point: Point
	itemClassName?: string
} & GuitarBoardProps) => {
	const {
		key,
		element,
		baseCls,
		status: { hidden },
	} = useBoardBtnContent(point)

	const cls = cx(baseCls, fretStyles['point'], hidden && fretStyles['empty-point'], itemClassName)
	const toneNode = (
		<div className={cls} key={key} data-key={key}>
			{element}
		</div>
	)
	const stringLine = point.grade !== 0 && <div className={fretStyles['point-string']}></div>

	return (
		<li className={cx(fretStyles['fret-point'], 'flex-center')}>
			{toneNode}
			{stringLine}
		</li>
	)
}

/**
 * 按钮形式 keyboard button
 */
const BoardButtonOriginal = ({ point, itemClassName }: { point: Point; itemClassName?: string } & GuitarBoardProps) => {
	const {
		key,
		element,
		baseCls,
		status: { hidden },
	} = useBoardBtnContent(point)

	const cls = cx(
		baseCls,
		hidden && styles['empty-point'], // 隐藏半音
		itemClassName
	)

	return (
		<li className={cls} key={key} data-key={key}>
			{element}
		</li>
	)
}

/**
 * 品记点位
 */
const BoardDots = ({ index, fretDot }: { index: number; fretDot?: boolean }) => {
	const {
		boardSettings: { numTag },
	} = useBoardContext()

	const dotsArr = [...Array(FRET_DOT[index - 1]?.length || 0)] // 当前标记点个数
	return (
		<>
			<li className={cx('primary-button', styles['frets-dot'])}>
				{numTag ? (
					<div className={styles['frets-dot-num']}>{index}</div>
				) : (
					<>
						{FRET_DOT[index - 1]}
						<span className={styles['frets-dot-text']}>{index}</span>
					</>
				)}

				{dotsArr.map((_, index) => (
					<div className={fretStyles['fret-dots-item']} key={index}></div>
				))}
			</li>
			{fretDot && (
				<li className={cx('flex-center', fretStyles['fret-dots'])}>
					{dotsArr.map((_, index) => (
						<div className={fretStyles['fret-dots-item']} key={index}></div>
					))}
				</li>
			)}
		</>
	)
}

/**
 * 获取按钮公共样式
 * @param point
 * @returns
 */
const useBoardBtnContent = (point: Point) => {
	const { boardSettings, taps, fixedTaps, highFixedTaps, emphasis } = useBoardContext()

	// key
	const key = `${point.index}`
	// 交互反馈强调的point
	const emphasised = emphasis.includes(key)
	// 固定的point
	const fixed = !!fixedTaps.find((tap) => tap.index === point.index)
	// 固定最高亮的point
	const highFixed = !!highFixedTaps.find((tap) => tap.index === point.index)
	// 被点击的point
	const tapped = !!taps.find((tap) => tap.index === point.index)
	// 可见的point
	const active = fixed || emphasised || highFixed || tapped
	// 显示音调文本(非固定&非强调&非选择的指位才忽视半音显示)
	const { note, interval, visible } = getPointNoteBySetting(point, boardSettings, active)

	const userCls = highFixed
		? styles['high-fixed-point']
		: emphasised
		? styles['emphasised-point']
		: tapped
		? styles['tapped-point']
		: fixed
		? styles['fixed-point']
		: ''

	return {
		baseCls: cx(userCls, 'primary-button', styles['point']),
		element: (
			<>
				<span className={styles.note}>{note}</span>
				{interval && <span className={styles.interval}>{interval}</span>}
			</>
		),
		status: {
			hidden: !visible,
			highFixed,
			emphasised,
			tapped,
			fixed,
		},
		key: `${point.index}`,
	}
}

/**
 * 二维keyboard数组纵横交换 例如：[弦][品] -> [品][弦]
 */
const exchangeBoardArray = (keyboard: Point[][]) => {
	const board: Point[][] = []
	keyboard.forEach((string, stringIndex) => {
		string.forEach((point, fretIndex) => {
			if (board[fretIndex]) {
				board[fretIndex][stringIndex] = point
			} else {
				board[fretIndex] = [point]
			}
		})
	})
	return board
}

/**
 * 二维keyboard数组降一维
 */
const exchangeBoardList = (keyboard: Point[][]) => {
	const list: Point[] = []
	keyboard.forEach((string) => {
		list.push(...string)
	})
	return list
}
