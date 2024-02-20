import { type Point, DEGREE_TAG_LIST } from '@buitar/to-guitar'
import { GuitarBoardSetting } from '@/pages/settings/config/controller.type'

/**
 * 根据指板设置获取 Tone 值
 * @param tone
 * @param options
 * @param visible 可见
 */
export const getPointNoteBySetting = (point: Point, options: GuitarBoardSetting, visible: boolean = true) => {
	const { isShowOuter, hasInterval, isRomanInterval } = options

	// 调外音
	const isOuter = point.interval.toString().length > 1
	if (!isShowOuter && isOuter && !visible) {
		return {}
	}

	let intervalText = point.interval as String
	// 级数显示
	if (isRomanInterval){
		intervalText = DEGREE_TAG_LIST[Number(point.interval) - 1]
	}
	
	// 忽略升降调半音
	return {
		note: point.note,
		interval: hasInterval ? intervalText : point.level
	}
}
