import { chordMap } from '@buitar/to-guitar'

/**和弦所有类型 */
export const tagList = Array.from(chordMap.values()).map((item) => item.tag)
/**和弦所有类型 根据度数分类列表（3度/4度/5度 构成音） */
export const tagTypedList = Array.from(chordMap.values()).reduce((prev: string[][], curr) => {
	const index = (curr.constitute?.length || 3) - 3
	if (!prev[index]) {
		prev[index] = []
	}
	prev[index].push(curr.tag)
	return prev
}, [])
export const PROGRESSIONS_KEY = 'progressions'
export type ProgressionItem = {
	/**
	 * 级数罗马数字名称
	 */
	name: number
	/**
	 * 和弦tag
	 */
	tag: string
	/**
	 * 重复拍数
	 */
	beat: number
}

export type ProgressionsConfig = {
	/**
	 * 和弦级数进行名称
	 */
	name: string
	/**
	 * 进行简介
	 */
	introduction: string
	/**
	 * 和弦进行 级数数组
	 */
	procession: ProgressionItem[]
}

export const progressionsConfig: ProgressionsConfig[] = [
	{
		name: '',
		introduction: '',
		procession: [
			{
				name: 1,
				tag: '',
				beat: 1,
			},
			{
				name: 2,
				tag: 'm',
				beat: 1,
			},
			{
				name: 5,
				tag: '7',
				beat: 1,
			},
			{
				name: 1,
				tag: '',
				beat: 1,
			},
		],
	},
	{
		name: '',
		introduction: '',
		procession: [
			{
				name: 6,
				tag: 'm',
				beat: 1,
			},
			{
				name: 4,
				tag: '',
				beat: 1,
			},
			{
				name: 5,
				tag: '',
				beat: 1,
			},
			{
				name: 1,
				tag: '',
				beat: 1,
			},
		],
	},
	{
		name: '',
		introduction: '',
		procession: [
			{
				name: 1,
				tag: 'm',
				beat: 1,
			},
			{
				name: 4,
				tag: '',
				beat: 1,
			},
			{
				name: 5,
				tag: '',
				beat: 2,
			},
		],
	},
	{
		name: 'Cannon',
		introduction: '',
		procession: [
			{
				name: 1,
				tag: '',
				beat: 1,
			},
			{
				name: 5,
				tag: '',
				beat: 1,
			},
			{
				name: 6,
				tag: 'm',
				beat: 1,
			},
			{
				name: 3,
				tag: 'm',
				beat: 1,
			},
			{
				name: 4,
				tag: '',
				beat: 1,
			},
			{
				name: 1,
				tag: '',
				beat: 1,
			},
			{
				name: 4,
				tag: '',
				beat: 1,
			},
			{
				name: 5,
				tag: '',
				beat: 1,
			},
		],
	},
]
