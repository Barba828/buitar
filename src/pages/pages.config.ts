import { routeMap } from './router'

export type PageIntroType = {
	title: string
	content: string[]
}

export const pagesIntroConfig = new Map<string, PageIntroType>([
	[
		routeMap.chordLib.path,
		{
			title: '找到你要的和弦',
			content: [
				'和弦库是一个收集了各种和弦的地方，你可以在这里找到你想要的和弦。五度圈帮助迅速查找和弦根音，辅以顺阶和弦或者和弦类型快速查询。',
				'优雅的算法帮你计算和弦多种指法，点击和弦卡片听取和弦琶音，亦或在吉他指板｜键盘指板上查看真实键位。',
			],
		},
	],
	[
		routeMap.chordAnalyzer.path,
		{
			title: '自由的编辑你的和弦',
			content: [
				'或许你想要的和弦不在和弦库中，或许你仍有自己手法，你可以在这里编辑或收藏你的和弦。假若算法猜不透你想要的和弦名称，你也可以自己定一个名称再加入收藏。',
				'五度圈还能帮你迅速找到根音。',
			],
		},
	],
	[
		routeMap.guitarTableture.path,
		{
			title: '从指型图熟悉指板',
			content: [
				'五度音阶学习',
				'并且对关系大小调&平行大小调运用自如',
			],
		},
	],
	[
		routeMap.progressions.path,
		{
			title: '更好玩的和弦级数玩法',
			content: [
				'选择或者新建一段级数和弦走向，即可获知具体和弦，甚至能在五度圈里灵活的切换调式',
				'音序机获取所有和弦音并自动生成4/4拍节奏，聆听这一调的悦耳和弦吧。',
			],
		},
	],
	[
		routeMap.collections.path,
		{
			title: '你的和弦都在这里',
			content: [
				'我们当然希望你熟练所有的和弦与转换，不过忘却与记忆是人之常态，所以我们提供了一个收藏夹，让你可以随时回顾。你也可以在每一个指法卡片上新增你的收藏。',
				'当前也提供了一些简单指法的默认收藏。',
			],
		},
	],
	[
		routeMap.instrument.path,
		{
			title: '游乐场时间到了',
			content: [
				'点击乐器即可选择在键盘上弹奏，当然你也可以直接使用鼠标｜触摸弹奏（实际上在所有乐器页面都可以弹奏该乐器）。',
				'吉他使用 Z A Q 三个键盘字母分别作为 1 2 3 弦零品，键位向右即是递增吉他品位，使用 shift 切换为 4 5 6弦，反之亦然',
				'键盘左侧使用 Z X C V B N M 行键盘作为白键，S D F H J行作为黑键，同理右侧使用 Y U I ... 行作为白键，8 9 ... 数字行作为黑键，表示C2 & C3音，使用 shift 切换为 C4 & C5',
			],
		},
	],
	[
		routeMap.creation.path,
		{
			title: '这是你的创作时间',
			content: [
				'音序机提供了多种乐器和配置用以编辑你喜欢的音乐节奏，你可以任意增加不同乐器的音序机，亦或是修改速度、音量、拍数等参数。当然也可以保存你的大作。',
				'拖拽移动音序条，点击可以新增或者移除音序条，拉动音序条可以改变音序条的长度（一个格子是16分音符）',
			],
		},
	],
])
