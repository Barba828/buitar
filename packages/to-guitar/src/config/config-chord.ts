/**
 * 和弦配置
 */
import type { ChordDegreeNum, ChordType, DegreeType, IntervalNum, ModeType } from '../interface'

/**
 * 和弦乐理配置
 */

/**
 * 和弦分类（以和弦半音距离为key）
 */
const chordMap = new Map<number, ChordType>([
	/**
	 * 三和弦
	 */
	[43, { tag: '', name: 'major triad', constitute: ['1', '3', '5'], name_zh: '大三和弦' }],
	[34, { tag: 'm', name: 'minor triad', constitute: ['1', '3b', '5'], name_zh: '小三和弦' }],
	[44, { tag: 'aug', name: 'augmented triad', constitute: ['1', '3', '5#'], name_zh: '增三和弦' }],
	[33, { tag: 'dim', name: 'diminished triad', constitute: ['1', '3b', '5b'], name_zh: '减三和弦' }],
	[25, { tag: 'sus2', name: 'suspended 2 chord', constitute: ['1', '2', '5'], name_zh: '挂二和弦' }],
	[52, { tag: 'sus4', name: 'suspended 4 chord', constitute: ['1', '4', '5'], name_zh: '挂四和弦' }],

	/**
	 * 三和弦拓展
	 */
	[223, { tag: 'add9', name: 'addition 9 chord', constitute: ['1', '3', '5', '9'], name_zh: '加九和弦' }],
	[214, { tag: 'm(add9)', name: 'minor addition 9 chord', constitute: ['1', '3b', '5', '9'], name_zh: '小加九和弦' }],
	[
		224,
		{
			tag: 'aug(add9)',
			name: 'augmented addition 9 chord',
			constitute: ['1', '3', '5#', '9'],
			name_zh: '增三加九和弦',
		},
	],
	[
		212,
		{
			tag: 'dim(add9)',
			name: 'diminished addition 9 chord',
			constitute: ['1', '3b', '5b', '9'],
			name_zh: '减三加九和弦',
		},
	],
	[412, { tag: 'add11', name: 'addition 11 chord', constitute: ['1', '3', '5', '11'], name_zh: '加十一和弦' }],
	[
		322,
		{ tag: 'm(add11)', name: 'minor addition 11 chord', constitute: ['1', '3b', '5', '11'], name_zh: '小加十一和弦' },
	],

	/**
	 * 七和弦
	 */
	[434, { tag: 'maj7', name: 'major seventh chord', constitute: ['1', '3', '5', '7'], name_zh: '大七和弦' }],
	[433, { tag: '7', name: 'seventh chord', constitute: ['1', '3', '5', '7b'], name_zh: '属七和弦' }], //（七和弦） 大七和弦 -> 给7度音一个降号 7b
	[343, { tag: 'm7', name: 'minor seventh chord', constitute: ['1', '3b', '5', '7b'], name_zh: '小七和弦' }], // 属七和弦 -> 给3度音一个降号 3b
	[
		334,
		{
			tag: 'm7(b5)' /**'m7-5' */,
			name: 'half-diminished seventh chord',
			constitute: ['1', '3b', '5b', '7b'],
			name_zh: '半减七和弦',
		},
	], // 小七和弦 -> 给5度音一个降号 5b
	[333, { tag: 'dim7', name: 'diminished seventh chord', constitute: ['1', '3b', '5b', '6'], name_zh: '减七和弦' }], //半减七和弦 -> 给7度音再给一个降号 bb7 （大-属-小-半-减 规律变化）
	[344, { tag: 'mM7', name: 'minor major seventh chord', constitute: ['1', '3b', '5', '7'], name_zh: '小大七和弦' }], // 大七和弦 -> 给3度音一个降号 3b
	[
		443,
		{
			tag: 'augM7' /**'M7#5' */,
			name: 'augmented major seventh chord',
			constitute: ['1', '3', '5#', '7'],
			name_zh: '增大七和弦',
		},
	], // 大七和弦 -> 给5度音一个升号 5#
	[
		442,
		{
			tag: 'aug7' /**'7#5' */,
			name: 'augmented seventh chord',
			constitute: ['1', '3', '5#', '7b'],
			name_zh: '增属七和弦',
		},
	], // （增七和弦）属七和弦 -> 给5度音一个升号 5#
	[
		523,
		{ tag: '7sus4', name: 'seventh suspended 4 chord', constitute: ['1', '4', '5', '7b'], name_zh: '属七挂四和弦' },
	],
	[432, { tag: '6', name: 'sixth chord', constitute: ['1', '3', '5', '6'], name_zh: '大六和弦' }],
	[342, { tag: 'm6', name: 'minor sixth chord', constitute: ['1', '3b', '5', '6'], name_zh: '小六和弦' }],
	[341, { tag: 'm(b6)', name: 'minor sixth chord', constitute: ['1', '3b', '5', '6b'], name_zh: '减六和弦' }],

	/**
	 * 七和弦拓展
	 * 因为这里的九音是#9或者b9（并非完全9度），实际上还是在7和弦上做的拓展，而非九和弦
	 * 并且注意#9的音程和b3的音程是一致的（忽略8度关系）
	 */
	[
		1333,
		{ tag: '7(b9)', name: 'seventh(b-ninth) chord', constitute: ['1', '3', '5', '7b', '9b'], name_zh: '属七(b9)和弦' },
	], // '1', '3', '5', '7b' 属七和弦拓展
	[
		3133,
		{ tag: '7(#9)', name: 'seventh(#-ninth) chord', constitute: ['1', '3', '5', '7b', '9#'], name_zh: '属七(#9)和弦' },
	],
	[
		1324,
		{
			tag: '7(b9b5)',
			name: 'seventh(b9b5) chord',
			constitute: ['1', '3', '5b', '7b', '9b'],
			name_zh: '属七(b9b5)和弦',
		},
	],
	[
		1342,
		{
			tag: '7(b9#5)',
			name: 'seventh(b9#5) chord',
			constitute: ['1', '3', '5#', '7b', '9b'],
			name_zh: '属七(b9#5)和弦',
		},
	],
	[
		3124,
		{
			tag: '7(#9b5)',
			name: 'seventh(#9b5) chord',
			constitute: ['1', '3', '5b', '7b', '9#'],
			name_zh: '属七(#9b5)和弦',
		},
	],
	[
		3142,
		{
			tag: '7(#9#5)',
			name: 'seventh(#9#5) chord',
			constitute: ['1', '3', '5#', '7b', '9#'],
			name_zh: '属七(#9#5)和弦',
		},
	],
	[
		4313,
		{
			tag: '7(#11)',
			name: 'seventh(#-eleventh) chord',
			constitute: ['1', '3', '5', '7b', '11#'],
			name_zh: '属七(#11)和弦',
		},
	],
	[
		4312,
		{
			tag: '7(b13/#5)',
			name: 'seventh(#-fifth) chord',
			constitute: ['1', '3', '5', '7b', '13b'],
			name_zh: '属七(b13/#5)和弦',
		},
	],
	[
		1334,
		{
			tag: 'maj7',
			name: 'major seventh(b-ninth) chord',
			constitute: ['1', '3', '5', '7', '9b'],
			name_zh: '大七(b9)和弦',
		},
	], // '1', '3', '5', '7' 大七和弦拓展
	[
		3134,
		{
			tag: 'maj7',
			name: 'major seventh(#-ninth) chord',
			constitute: ['1', '3', '5', '7', '9#'],
			name_zh: '大七(#9)和弦',
		},
	],
	[
		1243,
		{
			tag: 'm7(b9)',
			name: 'minor seventh(b-ninth) chord',
			constitute: ['1', '3b', '5', '7b', '9b'],
			name_zh: '小七(b9)和弦',
		},
	], // '1', '3b', '5', '7b' 小七和弦拓展
	// [1243, { tag: 'm7(#9)', name: 'minor seventh(#-ninth) chord', constitute: ['1', '3b', '5', '7b', '9#'], name_zh: '小七(#9)和弦' }], // 3b=9# 无意义
	[
		1234,
		{
			tag: 'm7(b9b5)',
			name: 'half-diminished seventh(b-ninth) chord',
			constitute: ['1', '3b', '5b', '7b', '9b'],
			name_zh: '半减七(b9)和弦',
		},
	],
	[
		1253,
		{
			tag: 'm7(b9#5)',
			name: 'minor seventh(b9#5) chord',
			constitute: ['1', '3b', '5#', '7b', '9b'],
			name_zh: '小七(b9#5)和弦',
		},
	], // 无意义

	/**
	 * 七和弦省略拓展
	 * 一般来说七和弦可以省略五音
	 */
	[47, { tag: 'maj7(no5)', name: 'major seventh(no5) chord', constitute: ['1', '3', '7'], name_zh: '大七(no5)和弦' }],
	[46, { tag: '7(no5)', name: 'seventh(no5) chord', constitute: ['1', '3', '7b'], name_zh: '属七(no5)和弦' }],
	[37, { tag: 'm7(no5)', name: 'minor seventh(no5) chord', constitute: ['1', '3b', '7b'], name_zh: '小七(no5)和弦' }],
	[
		137,
		{
			tag: 'maj7(b9no5)',
			name: 'major seventh(b-ninth no5) chord',
			constitute: ['1', '3', '7', '9b'],
			name_zh: '大七(b9)和弦',
		},
	],
	[
		317,
		{
			tag: 'maj7(#9no5)',
			name: 'major seventh(#-ninth no5) chord',
			constitute: ['1', '3', '7', '9#'],
			name_zh: '大七(#9no5)和弦',
		},
	],
	[136, { tag: '7(b9no5)', name: 'seventh(b-ninth no5) chord', constitute: ['1', '3', '7b', '9b'], name_zh: '属七(b9no5)和弦' }],
	[316, { tag: '7(#9no5)', name: 'seventh(#-ninth no5) chord', constitute: ['1', '3', '7b', '9#'], name_zh: '属七(#9no5)和弦' }],
	[
		127,
		{
			tag: 'm7(b9no5)',
			name: 'minor(b-ninth no5) seventh chord',
			constitute: ['1', '3b', '7b', '9b'],
			name_zh: '小七(b9no5)和弦',
		},
	],

	/**
	 * 九和弦(必须是完全九度，所以这里的key都是2开头)
	 * 计算复音程真TMD麻烦
	 */
	[2234, { tag: 'maj9', name: 'major ninth chord', constitute: ['1', '3', '5', '7', '9'], name_zh: '大九和弦' }],
	[2233, { tag: '9', name: 'ninth chord', constitute: ['1', '3', '5', '7b', '9'], name_zh: '属九和弦' }],
	[2143, { tag: 'm9', name: 'minor ninth chord', constitute: ['1', '3b', '5', '7b', '9'], name_zh: '小九和弦' }],
	[
		2134,
		{
			tag: 'dim9-5',
			name: 'half-diminished ninth chord',
			constitute: ['1', '3b', '5b', '7b', '9'],
			name_zh: '半减九和弦',
		},
	],
	[2133, { tag: 'dim9', name: 'diminished ninth chord', constitute: ['1', '3b', '5b', '6', '9'], name_zh: '减九和弦' }],
	[
		2224,
		{ tag: '9(b5)', name: 'ninth(b-fifth) chord', constitute: ['1', '3', '5b', '7b', '9'], name_zh: '属九(b5)和弦' },
	],
	[
		2144,
		{ tag: 'mM9', name: 'minor major ninth chord', constitute: ['1', '3b', '5', '7', '9'], name_zh: '小大九和弦' },
	],
	[
		2243,
		{
			tag: 'augM9',
			name: 'augmented major ninth chord',
			constitute: ['1', '3', '5#', '7', '9'],
			name_zh: '增大九和弦',
		},
	],
	[2242, { tag: 'aug9', name: 'augmented ninth chord', constitute: ['1', '3', '5#', '7b', '9'], name_zh: '增九和弦' }], // 属九(#5)和弦
	[2323, { tag: '9sus4', name: 'suspended 4 chord', constitute: ['1', '4', '5', '7b', '9'], name_zh: '属九挂四和弦' }],
	[2232, { tag: '69', name: 'sixth ninth chord', constitute: ['1', '3', '5', '6', '9'], name_zh: '六九和弦' }],
	[
		2142,
		{ tag: 'm69', name: 'minor sixth ninth chord', constitute: ['1', '3b', '5', '6', '9'], name_zh: '小六九和弦' },
	],
	[
		2141,
		{ tag: 'mb69', name: 'minor b-sixth ninth chord', constitute: ['1', '3b', '5', '6b', '9'], name_zh: '减六九和弦' },
	],

	/**
	 * 九和弦省略拓展
	 * 一般九和弦可以省略五音
	 */
	[227, { tag: 'maj9', name: 'major seventh chord', constitute: ['1', '3', '7', '9'], name_zh: '大九和弦' }],
	[226, { tag: '9', name: 'seventh chord', constitute: ['1', '3', '7b', '9'], name_zh: '属九和弦' }],
	[217, { tag: 'm9', name: 'minor seventh chord', constitute: ['1', '3b', '7b', '9'], name_zh: '小九和弦' }],
	[218, { tag: 'mM9', name: 'minor major ninth chord', constitute: ['1', '3b', '7', '9'], name_zh: '小大九和弦' }],
	[225, { tag: '69', name: 'sixth ninth chord', constitute: ['1', '3', '6', '9'], name_zh: '六九和弦' }],
	[216, { tag: 'm69', name: 'minor sixth ninth chord', constitute: ['1', '3b', '6', '9'], name_zh: '小六九和弦' }],
	[215, { tag: 'mb69', name: 'minor b-sixth ninth chord', constitute: ['1', '3b', '6b', '9'], name_zh: '减六九和弦' }],

	/**
	 * 十一和弦
	 */
	[
		22214,
		{
			tag: 'maj#11',
			name: 'major #-eleventh chord',
			constitute: ['1', '3', '5', '7', '9', '11#'],
			name_zh: '大升十一和弦',
		},
	],
	[22123, { tag: '11', name: 'eleventh chord', constitute: ['1', '3', '5', '7b', '9', '11'], name_zh: '属十一和弦' }],
	[
		21223,
		{ tag: 'm11', name: 'minor eleventh chord', constitute: ['1', '3b', '5', '7b', '9', '11'], name_zh: '小十一和弦' },
	],

	/**
	 * 十三和弦
	 */
	[
		222122,
		{
			tag: 'maj13',
			name: 'major eleventh chord',
			constitute: ['1', '3', '5', '7', '9', '11#', '13'],
			name_zh: '大十三和弦',
		},
	],
	[
		221221,
		{ tag: '13', name: 'eleventh chord', constitute: ['1', '3', '5', '7b', '9', '11', '13'], name_zh: '属十三和弦' },
	],
	[
		212221,
		{
			tag: 'm13',
			name: 'minor eleventh chord',
			constitute: ['1', '3b', '5', '7b', '9', '11', '13'],
			name_zh: '小十三和弦',
		},
	],
])
/**
 * 和弦分类（以和弦tag为key）
 */
const chordTagMap = (() => {
	const map = new Map<string, Omit<ChordType, 'tag'> & { key: number }>()

	for (const [key, value] of chordMap) {
		const { tag, ...rest } = value
		if (!map.has(value.tag)) {
			map.set(value.tag, { key, ...rest })
		}
	}

	return map
})()

/**
 * 和弦级数分类
 */
const degreeMap = new Map<ModeType, Readonly<DegreeType>[]>([
	[
		'major', // 自然大调 Ionian
		[
			{ interval: 0, degreeNum: 1, scale: 'Tonic', roll: 'Do' }, // 主，稳定
			{ interval: 2, degreeNum: 2, scale: 'Supertonic', roll: 'Re' }, // 上主
			{ interval: 4, degreeNum: 3, scale: 'Mediant', roll: 'Mi' }, // 中，张力很小
			{ interval: 5, degreeNum: 4, scale: 'Subdominant', roll: 'Fa' }, // 下属，张力模糊
			{ interval: 7, degreeNum: 5, scale: 'Dominant', roll: 'So' }, // 属，张力大而和谐
			{ interval: 9, degreeNum: 6, scale: 'Submediant', roll: 'La' }, // 下中
			{ interval: 11, degreeNum: 7, scale: 'Leading Tone', roll: 'Ti' }, // 导，张力最大
		],
	],
	[
		'minor', // 自然小调 Aeolian
		[
			{ interval: 0, degreeNum: 1, scale: 'Tonic', roll: 'Do' }, // 主
			{ interval: 2, degreeNum: 2, scale: 'Supertonic', roll: 'Re' }, // 上主
			{ interval: 3, degreeNum: 3, scale: 'Mediant', roll: 'Mi' }, // 中
			{ interval: 5, degreeNum: 4, scale: 'Subdominant', roll: 'Fa' }, // 下属
			{ interval: 7, degreeNum: 5, scale: 'Dominant', roll: 'So' }, // 属
			{ interval: 8, degreeNum: 6, scale: 'Submediant', roll: 'Le' }, // 下中 旋律小调 interval = 9, roll = 'La'
			{ interval: 10, degreeNum: 7, scale: 'SubTonic', roll: 'Te' }, // 下主 和声小调/旋律小调 interval = 11, roll = 'Ti' 即为 导音
		],
	],
	[
		/**
		 * 大调五度音阶音程关系
		 * 音：1 2 3 5 6 | CDEGA
		 * 宫商角徴羽（宫调式 ）
		 */
		'major-pentatonic',
		[
			{ interval: 0, degreeNum: 1, scale: 'Tonic', roll: 'Do' },
			{ interval: 2, degreeNum: 2, scale: 'Supertonic', roll: 'Re' },
			{ interval: 4, degreeNum: 3, scale: 'Mediant', roll: 'Mi' },
			{ interval: 7, degreeNum: 5, scale: 'Dominant', roll: 'So' },
			{ interval: 9, degreeNum: 6, scale: 'Submediant', roll: 'La' },
		],
	],
	[
		/**
		 * 小调五度音阶音程关系
		 * 音：1 b3 4 5 b7 | ACDEG
		 * 羽宫商角徴（羽调式）
		 */
		'minor-pentatonic',
		[
			{ interval: 0, degreeNum: 1, scale: 'Tonic', roll: 'Do' },
			{ interval: 3, degreeNum: 3, scale: 'Mediant', roll: 'Mi' },
			{ interval: 5, degreeNum: 4, scale: 'Subdominant', roll: 'Fa' },
			{ interval: 7, degreeNum: 5, scale: 'Dominant', roll: 'So' },
			{ interval: 10, degreeNum: 7, scale: 'SubTonic', roll: 'Te' },
		],
	],
	[
		/**
		 * 大调布鲁斯
		 * 大调五声音阶中加入了降III级的音
		 */
		'major-blues',
		[
			{ interval: 0, degreeNum: 1, scale: 'Tonic', roll: 'Do' },
			{ interval: 2, degreeNum: 2, scale: 'Supertonic', roll: 'Re' },
			{ interval: 3, degreeNum: 3, scale: 'Mediant', roll: 'Mi' }, // scale & roll error
			{ interval: 4, degreeNum: 3, scale: 'Mediant', roll: 'Mi' },
			{ interval: 7, degreeNum: 5, scale: 'Dominant', roll: 'So' },
			{ interval: 9, degreeNum: 6, scale: 'Submediant', roll: 'La' },
		],
	],
	[
		/**
		 * 小调布鲁斯
		 * 小调五声音阶添加了一个升IV级音
		 */
		'minor-blues',
		[
			{ interval: 0, degreeNum: 1, scale: 'Tonic', roll: 'Do' },
			{ interval: 3, degreeNum: 3, scale: 'Mediant', roll: 'Mi' },
			{ interval: 5, degreeNum: 4, scale: 'Subdominant', roll: 'Fa' },
			{ interval: 6, degreeNum: 4, scale: 'Subdominant', roll: 'Fa' }, // scale & roll error
			{ interval: 7, degreeNum: 5, scale: 'Dominant', roll: 'So' },
			{ interval: 10, degreeNum: 7, scale: 'SubTonic', roll: 'Te' },
		],
	],
	// @todo [...]
])

/**
 * 顺接和弦级数
 * 三和弦/七和弦/九和弦
 */
const chordDegreeMap = new Map<ChordDegreeNum, { name: string; interval: number[] }>([
	[
		3,
		{
			name: 'triad',
			interval: [1, 3, 5],
		},
	],
	[
		7,
		{
			name: 'seventh chord',
			interval: [1, 3, 5, 7],
		},
	],
	[
		9,
		{
			name: 'ninth chord',
			interval: [1, 3, 5, 7, 9], // 这里的9并不严谨，九音是严格的根音的大二度
		},
	],
])

/**
 * 度数=>半音程转换映射
 */
const intervalMap = new Map<IntervalNum, number>([
	[1, 0], // 一度音程 0
	[2, 2], // 大二度 2（大/小：可能垮半音）-> 小二度 1
	[3, 4], // 大三度	4（大/小：可能垮半音）-> 小三度 3
	[4, 5], // 完全四度 5 （一定跨半音） -> 增四度 6
	[5, 7], // 完全五度 7 （一定跨半音） -> 减五度 6
	[6, 9], // 大六度 9（大/小：可能垮两个半音）	-> 小六度 8
	[7, 11], // 大七度 11（大/小：可能垮两个半音）-> 小七度 10
	// 复合音程(+八度，算法实现)
	// ['8', 12], // 八度
	// ['9', 14], // 大九度
	// ['10', 16], // 大十度
	// ['11', 17], // 完全十一度
])

export { chordMap, chordTagMap, degreeMap, chordDegreeMap, intervalMap }
