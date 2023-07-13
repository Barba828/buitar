import React, { useEffect } from 'react'
import { GuitarBoard, ChordCard, BoardProvider, useBoardContext } from '@/components/guitar-board'
import { Link } from 'react-router-dom'
import { Point, transChordType } from '@to-guitar'
import { Icon } from '@/components'
import { routeMap } from '@/pages/router'

import cx from 'classnames'
import styles from './home.module.scss'

export const HomePage = () => {
	return (
		<div className={styles.container}>
			<h1 className={styles.title}>Buitar</h1>
			<h2 className={styles.subtitle}>轻松开始吉他之旅</h2>

			<p className={styles.intro}>
				<span>同步的音频和完善的吉他指板信息</span>
				<span>真正懂理论的算法实时计算和弦</span>
			</p>
			<p className={styles.intro}>
				<span>不同调式顺阶和弦，任意转换级数和弦</span>
				<span>利用和弦和节奏创作音乐骨架</span>
			</p>

			<div className={styles.links}>
				<Link to={routeMap.chordLib.path} className={cx('buitar-primary-button', styles['links-button'])}>
					先从顺阶和弦开始
				</Link>
				<Link to={routeMap.chordAnalyzer.path} className={cx('buitar-primary-button', styles['links-button'])}>
					定义我的和弦
				</Link>
			</div>

			<div className={cx(styles.more, styles.intro)}>
				<Icon name="icon-back" size={14} />
				菜单查看更多功能
			</div>

			<div className={styles.example}>
				<h2>或者</h2>
				尝试从 C 大调 G
				和弦开始吧！点击指板即可发出悦耳弦音，若需要更改指板显示方式或者演奏乐器，可在左栏详细设置。点击和弦图卡片还能演奏琶音。
			</div>
			<BoardProvider>
				<Example />
			</BoardProvider>
		</div>
	)
}

const GIndex = [3, 18, 32, 48, 64, 83]

const Example = () => {
	const { taps, guitarBoardOption, setTaps, setChordTaps } = useBoardContext()

	if (!guitarBoardOption.keyboard) return null

	const GChords = transChordType(['G', 'B', 'D'])
	const GChordTaps: Point[] = []
	guitarBoardOption.keyboard.forEach((string) => {
		string.forEach((point) => {
			if (GIndex.includes(point.index)) {
				GChordTaps.push(point)
			}
		})
	})

	useEffect(() => {
		setTaps(GChordTaps)
		setChordTaps({ chordType: GChords, chordList: [] })
	}, [])
	return (
		<>
			<GuitarBoard />
			<ChordCard taps={taps} />
		</>
	)
}
