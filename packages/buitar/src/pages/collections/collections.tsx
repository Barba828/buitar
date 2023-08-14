import { RangeSlider, useBoardContext, usePagesIntro } from '@/components'
import { ChordList } from '@/components/chord-list'
import { Tone, getTapsOnBoard, transToneOffset } from '@buitar/to-guitar'
import { CagedBaseType, GuitarCagedBaseConfig } from './caged.config'
import { FC, useCallback, useMemo, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useRouteFind, useRouteMatch } from '@/utils/hooks/use-routers'
import cx from 'classnames'

import styles from './collections.module.scss'

export const Collections: FC = () => {
	const intro = usePagesIntro()
	const CollectionsHomeRoute = useRouteFind('ChordCollections') // 工具菜单页路由
	const curRoute = useRouteMatch() // 当前页面一级路由

	return (
		<>
			{CollectionsHomeRoute === curRoute && intro}
			<Outlet />
		</>
	)
}

export const StorageCollection: FC = () => {
	const { collection } = useBoardContext()

	return (
		<>
			{collection.map((item, index) => (
				<ChordList key={index} data={item.data} title={item.title} />
			))}
		</>
	)
}

export const CagedCollection: FC = () => {
	const {
		guitarBoardOption: { keyboard },
		instrumentKeyboard,
	} = useBoardContext()
	const myCollectionsRoute = useRouteFind('ChordCollectionsOfMine')

	const [startGrade, setStartGrade] = useState(0)

	const config = useMemo(() => {
		if (instrumentKeyboard === 'guitar') {
			Object.keys(GuitarCagedBaseConfig).forEach((cagedKey) => {
				const chords = GuitarCagedBaseConfig[cagedKey]
				const offsetTone = transToneOffset(cagedKey as Tone, startGrade)
				chords.forEach((chord) => {
					chord.tone = offsetTone
					chord.tapPositions.forEach(
						(position) => (position.grade = position.baseGrade + startGrade)
					)
				})
			})
			return GuitarCagedBaseConfig
		}
		/**
		 * @ToDo 贝斯和尤克里里的默认指法
		 */
		return {} as CagedBaseType
	}, [startGrade])

	const handleChangeSlider = useCallback(([start]) => {
		setStartGrade(start)
	}, [])

	return (
		<>
			<Link to={myCollectionsRoute.path} className={styles['my-collections-link']}>
				我的收藏〉
			</Link>
			<div className={styles['caged-range']}>
				<div className={cx('buitar-primary-button', 'flex-center', styles['caged-range-title'])}>
					品位 {startGrade}
				</div>
				<RangeSlider
					size={2}
					range={[0, 12]}
					onChange={handleChangeSlider}
					className={styles['caged-range-slider']}
				/>
			</div>
			{Object.keys(config).map((key) => (
				<ChordList
					key={key}
					data={config[key].map((item) => ({
						title: `${item.tone}${item.tag}`,
						taps: getTapsOnBoard(item.tapPositions as any, keyboard),
					}))}
					title={key}
					disableCollect
					titleClassName={styles['caged-title']}
				/>
			))}
		</>
	)
}
