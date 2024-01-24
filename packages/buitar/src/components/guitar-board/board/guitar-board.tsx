import { FC, useCallback, useEffect, useMemo, useRef } from 'react'
import type { Point, ToneSchema } from '@buitar/to-guitar'
import { useBoardContext } from '../board-provider'
import { getBoardOptionsTone } from '../utils'
import { GuitarBoardSetting } from '@/pages/settings/config/controller.type'
import { useBoardTouch, useGuitarKeyDown } from '@/utils/hooks/use-board-event'
import { useDebounce } from '@/utils/hooks/use-debouce'
import { Icon } from '@/components'
import cx from 'classnames'
import styles from './guitar-board.module.scss'
import fretStyles from './guitar-board-fret.module.scss'
import { useIsTouch } from '@/utils/hooks/use-device'

interface GuitarBoardProps {
	/**渲染吉他品数范围 */
	range?: [number, number]
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
	onCheckedPoints,
	onChangePart,
}) => {
	const {
		guitarBoardOption: { keyboard, baseFret },
		boardSettings: { hasTag, numTag, isStickyZero = true },
		boardTheme,
		taps,
		emphasis,
		setEmphasis,
		player,
	} = useBoardContext()
	const boardRange = range[0] < 1 ? [1, range[1]] : range
	const scrollRef = useRef<HTMLDivElement>(null)
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
	const handleTouchKey = useCallback(
		(key: string) => {
			if (key.length && boardList && isTouchDevice) {
				const point = boardList[Number(key)]
				onCheckedPoints?.([point])
			}
		},
		[boardList]
	)

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

	// 指位停留 30 ms以上 => play & checked
	const debouceEmphasis = useDebounce(emphasis, 30)
	useEffect(() => {
		if (debouceEmphasis.length <= 0 || !boardList) {
			return
		}
		const points = debouceEmphasis.map((index) => boardList[Number(index)])
		console.log(
			'%c Points ',
			'color:white; background:rgb(57, 167, 150);border-radius: 2px',
			points
		)
		onCheckedPoints?.(points)
	}, [debouceEmphasis])

	useEffect(() => {
		onChangePart?.(part)
	}, [part])

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
		const fretsView = frets
			.reverse()
			.map((point, stringIndex) => <BoardBtnComponent key={stringIndex} point={point} />)

		const dotsView =
			boardTheme === 'default' ? (
				<BoardDotsOriginal index={fretIndex + boardRange[0]} />
			) : (
				<BoardDots index={fretIndex + boardRange[0]} />
			)
		return (
			<ul className={cx(styles.frets)} key={fretIndex}>
				{fretsView}
				{dotsView}
			</ul>
		)
	})

	const zeroView = board.slice(0, 1).map((frets, fretIndex) => {
		const fretsView = frets
			.reverse()
			.map((point, stringIndex) => (
				<BoardBtnComponent key={stringIndex} point={point} visible={true} stringVisible={false} />
			))

		// 存在数字标记才显示播放按钮
		const playButton = hasTag && numTag && (
			<div
				onClick={handlePlayArpeggio}
				className={cx('primary-button', styles['frets-dot'], styles['point'])}
			>
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

const BoardButton = ({
	point,
	itemClassName,
	visible = false,
	stringVisible = true,
}: {
	point: Point
	itemClassName?: string
	/** 按钮默认可见 */
	visible?: boolean
	/** 弦默认可见 */
	stringVisible?: boolean
} & GuitarBoardProps) => {
	const {
		key,
		element,
		baseCls,
		status: { hidden },
	} = useBoardBtnContent(point)

	const cls = cx(
		baseCls,
		fretStyles['point'],
		hidden && !visible && fretStyles['empty-point'],
		itemClassName
	)
	const toneNode = (
		<div className={cls} key={key} data-key={key}>
			{element}
		</div>
	)
	const stringLine = stringVisible && <div className={fretStyles['point-string']}></div>

	return (
		<li className={cx(fretStyles['fret-point'], 'flex-center')}>
			{toneNode}
			{stringLine}
		</li>
	)
}
const BoardDots = ({ index }: { index: number }) => {
	const {
		boardSettings: { hasTag, numTag },
	} = useBoardContext()

	if (!hasTag) {
		return <></>
	}

	const dotsArr = [...Array(FRET_DOT[index - 1]?.length || 0)] // 当前标记点个数
	return numTag ? (
		<li className={cx('flex-center', fretStyles['fret-num-dots'], styles['frets-dot'])}>{index}</li>
	) : (
		<div className={cx('flex-center', fretStyles['fret-dots'])}>
			{dotsArr.map((_, index) => (
				<div className={fretStyles['fret-dots-item']} key={index}></div>
			))}
		</div>
	)
}

const BoardButtonOriginal = ({
	point,
	itemClassName,
}: { point: Point; itemClassName?: string } & GuitarBoardProps) => {
	const { boardSettings, taps, fixedTaps, highFixedTaps, emphasis } = useBoardContext()
	const { hasLevel, isNote } = boardSettings

	// key
	const key = `${point.index}`
	// 交互反馈强调的point (active)
	const emphasised = emphasis.includes(key)
	// 固定的point
	const fixed = !!fixedTaps.find((tap) => tap.index === point.index)
	// 固定最高亮的point
	const highFixed = !!highFixedTaps.find((tap) => tap.index === point.index)
	// 被点击的point
	const tapped = !!taps.find((tap) => tap.index === point.index)
	// 显示音调文本(非固定&非强调&非选择的指位才忽视半音显示)
	const tone = getBoardOptionsTone(
		point.toneSchema,
		boardSettings,
		!tapped && !fixed && !emphasised
	)
	// 显示八度音高
	const level = tone && getLevel(point.toneSchema, boardSettings)

	const cls = cx(
		'primary-button',
		!tone && styles['empty-point'], // 隐藏半音
		!isNote && hasLevel && point.toneSchema.level //处理数字显示时八度音高
			? point.toneSchema.level > 3
				? styles['interval-point-reverse']
				: styles['interval-point']
			: null,
		emphasised && styles['emphasised-point'], // 被强调的point
		fixed && styles['fixed-point'], // 被固定高亮的point
		tapped && styles['tapped-point'], // 被点击的point
		highFixed && styles['high-fixed-point'], // 被点击的point
		styles['point'],
		itemClassName
	)

	return (
		<li className={cls} key={key} data-key={key}>
			{tone}
			{level}
		</li>
	)
}
const BoardDotsOriginal = ({ index }: { index: number }) => {
	const {
		boardSettings: { hasTag, numTag },
	} = useBoardContext()

	if (!hasTag) {
		return <></>
	}

	return (
		<div className={cx('primary-button', styles['frets-dot'])}>
			{numTag ? (
				<div className={styles['frets-dot-num']}>{index}</div>
			) : (
				<>
					{FRET_DOT[index - 1]}
					<span className={styles['frets-dot-text']}>{index}</span>
				</>
			)}
		</div>
	)
}

/**
 * 数字显示下的八度音高UI
 * @param toneSchema
 * @param boardSettings
 */
const getLevel = (toneSchema: ToneSchema, boardSettings: GuitarBoardSetting) => {
	if (!boardSettings.hasLevel || !toneSchema.level) {
		return null
	}
	const { level } = toneSchema
	if (boardSettings.isNote) {
		return <span className={styles.level}>{level}</span>
	}
	return (
		<span className={styles['level-dot']}>{new Array(Math.abs(level - 3)).fill('·').join('')}</span>
	)
}

/**
 * 获取按钮公共样式
 * @param point
 * @returns
 */
const useBoardBtnContent = (point: Point) => {
	const { boardSettings, taps, fixedTaps, highFixedTaps, emphasis } = useBoardContext()
	const { hasLevel, isNote } = boardSettings

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
	// 显示音调文本(非固定&非强调&非选择的指位才忽视半音显示)
	const tone = getBoardOptionsTone(point.toneSchema, boardSettings, false)
	// 显示八度音高
	const level = tone && getLevel(point.toneSchema, boardSettings)

	const hidden = !(fixed || emphasised || highFixed || tapped)

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
		baseCls: cx(
			userCls,
			'primary-button',
			styles['point'],
			!isNote && hasLevel && point.toneSchema.level //处理数字显示时八度音高
				? point.toneSchema.level > 3
					? styles['interval-point-reverse']
					: styles['interval-point']
				: null
		),
		element: (
			<>
				{tone}
				{level}
			</>
		),
		status: {
			hidden,
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
