import { type Point, DEGREE_TAG_LIST } from '@buitar/to-guitar'
import { GuitarBoardSetting } from '@/pages/settings/config/controller.type'

/**
 * 根据指板设置获取 Tone 值
 * @param tone
 * @param options
 * @param active 活动按钮
 */
export const getPointNoteBySetting = (point: Point, options: GuitarBoardSetting, active: boolean = true) => {
	const { isShowUnActive, isShowOuter, hasInterval, isRomanInterval } = options

	// 调外音
	const isOuter = point.interval.toString().length > 1
	let visible = true
	if (active || point.grade === 0) {
		// 1. 活动按钮｜0品按钮 显示
		visible = true
	} else if (!isShowUnActive) {
		// 2. 不显示非活动按钮（active = false）
		visible = false
	} else if (!isShowOuter) {
		// 2. 不显示调外音
		visible = !isOuter
	}

	let intervalText = point.interval as String
	// 级数显示
	if (isRomanInterval) {
		intervalText = DEGREE_TAG_LIST[Number(point.interval) - 1]
	}

	// 忽略升降调半音
	return {
		note: point.note,
		interval: hasInterval ? intervalText : point.level,
		visible: visible,
	}
}
