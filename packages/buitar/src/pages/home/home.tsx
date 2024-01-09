import { useEffect } from 'react'
import { GuitarBoard, ChordCard, useBoardContext } from '@/components/guitar-board'
import { Link } from 'react-router-dom'
import { transChordTaps } from '@buitar/to-guitar'
import { Icon, PagesMeta } from '@/components'
import { routeConfig } from '@/pages/router'
import { useIsMobile } from '@/utils/hooks/use-device'
import { useRouteFind } from '@/utils/hooks/use-routers'

import cx from 'classnames'
import styles from './home.module.scss'

export const HomePage = () => {
	const isMobile = useIsMobile()

	return (
		<div className={styles.container}>
			<PagesMeta />
			<Title />
			{isMobile ? <MobileHome /> : <PcHome />}
		</div>
	)
}

const MobileHome = () => {
	return (
		<div className={cx(styles['menu-container'])}>
			{routeConfig
				.filter((route) => route.type === 'menu')
				.map((route) => {
					return route.children ? (
						<div className={cx(styles['sub-route-wrap'])} key={route.path}>
							{route.children
								.filter((route) => !!route.name)
								.map((subRoute) => (
									<Link
										key={subRoute.path}
										to={subRoute.path}
										className={cx('primary-button', styles['sub-route'])}
									>
										<div>{subRoute.name}</div>
									</Link>
								))}
						</div>
					) : (
						<Link
							key={route.path}
							to={route.path}
							className={cx('primary-button', styles['main-route'])}
						>
							<span>{route.name}</span>
						</Link>
					)
				})}
		</div>
	)
}

const PcHome = () => {
	const ChordLibrary = useRouteFind('ChordLibrary')
	const ChordAnalyzer = useRouteFind('ChordAnalyzer')
	return (
		<>
			<p className={styles.intro}>
				<span>同步的音频和完善的吉他指板信息</span>
				<span>真正懂理论的算法实时计算和弦</span>
			</p>
			<p className={styles.intro}>
				<span>不同调式顺阶和弦，任意转换级数和弦</span>
				<span>利用和弦和节奏创作音乐骨架</span>
			</p>

			<div className={styles.links}>
				<Link to={ChordLibrary.path} className={cx('primary-button', styles['links-button'])}>
					先从顺阶和弦开始
				</Link>
				<Link to={ChordAnalyzer.path} className={cx('primary-button', styles['links-button'])}>
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
			<Example />
		</>
	)
}

const Title = () => (
	<>
		<h1 className={styles.title}>Buitar</h1>
		<h2 className={styles.subtitle}>轻松开始吉他之旅</h2>
	</>
)

const Example = () => {
	const { taps, guitarBoardOption, setTaps, setChordTap, setChordTaps, clearTaps } =
		useBoardContext()

	if (!guitarBoardOption.keyboard) return null

	const GChordTaps = transChordTaps(['G', 'B', 'D'], guitarBoardOption)

	useEffect(() => {
		setChordTaps(GChordTaps)
		setChordTap(GChordTaps[0])
		setTaps(GChordTaps[0].chordTaps)
		return () => clearTaps()
	}, [])
	return (
		<>
			<GuitarBoard />
			<ChordCard taps={taps} title="G" />
		</>
	)
}
