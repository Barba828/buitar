import { type Point, DEGREE_TAG_LIST } from '@buitar/to-guitar'
import { GuitarBoardSetting } from '@/pages/settings/config/controller.type'

/**
 * 根据指板设置获取 Tone 值
 * @param tone
 * @param options
 * @param active 活动按钮
 */
export const getPointNoteBySetting = (point: Point, options: GuitarBoardSetting, active: boolean = true) => {
	const { isShowOuter, hasInterval, isRomanInterval } = options

	// 调外音
	const isOuter = point.interval.toString().length > 1
	// 可见：1.显示调外音(全部显示) 2.调内音 3.活动状态的调外音 4.是0品音
	const visible = isShowOuter || !isOuter || (isOuter && active) || point.grade === 0

	let intervalText = point.interval as String
	// 级数显示
	if (isRomanInterval){
		intervalText = DEGREE_TAG_LIST[Number(point.interval) - 1]
	}
	
	// 忽略升降调半音
	return {
		note: point.note,
		interval: hasInterval ? intervalText : point.level,
		visible: visible
	}
}
