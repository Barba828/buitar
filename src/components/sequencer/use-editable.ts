import { useEffect, useRef, useState } from 'react'
import type { Block, Sound } from './sequencer'

import styles from './sequencer.module.scss'

/**
 * 根据 data-sq 属性 active/handler/empty编辑sounds
 * @returns
 */
export const useEditable = ({
	itemSize,
	itemSizeY,
	soundList: sounds,
	maxLength,
	container,
	editable,

	onChange,
}: {
	itemSize: number
	itemSizeY: number
	soundList: Sound[]
	maxLength: number
	container: React.RefObject<HTMLDivElement>
	editable?: boolean

	onChange?: (sounds: Sound) => void
}) => {
	const [soundList, setSoundList] = useState(sounds)

	const start = useRef<[number, number]>([0, 0]) // 音序图左上起始坐标
	const offset = useRef<[number, number]>([0, 0]) // 拖拽时，鼠标锚点相对于音序条位置
	const dragable = useRef<false | 'drag' | 'resize'>(false) // 拖拽触发类型
	const preTargetData = useRef<[number, number, number]>([-1, 0, 0]) // mouseenter事件前音序条位置，判断点击之后之后位置有更改则更新，无更改则删除

	useEffect(() => {
		if (!container.current) return
		const { x, y } = container.current.getBoundingClientRect()
		start.current = [x + Number(styles.button_size) + 2 * Number(styles.sound_margin), y]
	}, [container.current])

	useEffect(() => {
		setSoundList(sounds)
	}, [sounds])

	/**
	 * 幽灵条
	 * yIndex, xIndex, length -> 纵轴位置，横轴位置，长度
	 */
	const [ghost, setGhost] = useState<[number, number, number]>([-1, 0, 0])

	if (!editable) {
		return { dispatch: {}, ghost }
	}

	/**
	 * 生成拖拽幽灵条
	 * 根据 client 位置和 start 位置计算被拖拽条绝对位置
	 * 幽灵条长度不变，改变(x,y)坐标
	 */
	const handleDragGhost = (e: React.MouseEvent) => {
		const { clientX, clientY } = e
		const [x, y] = start.current
		const [offsetX] = offset.current
		const yIndex = Math.floor((clientY - y) / itemSizeY)
		const zIndex = Math.floor((clientX - x - offsetX) / itemSize)

		// 更新幽灵条位置
		setGhost([yIndex, zIndex, ghost[2]])
	}

	/**
	 * 生成resize幽灵条
	 * 计算 resize-handler 绝对位置改变幽灵条长度
	 * 幽灵条位置，改变长度
	 */
	const handleResizeGhost = (e: React.MouseEvent) => {
		const { clientX } = e
		const [x] = start.current
		const left = ghost[1] * itemSize + x
		const length = Math.floor((clientX - left) / itemSize)
		length >= 0 && (ghost[2] = length)

		// 更新幽灵条位置
		setGhost([...ghost])
	}

	/**
	 * 更新UI添加sound
	 */
	const updateSoundList = () => {
		const blocks = soundList[ghost[0]].blocks
		const block: Block = [ghost[1], ghost[1] + ghost[2]] // 例 [2, 4]
		block[0] < 0 && (block[0] = 0)
		block[1] > maxLength - 1 && (block[1] = maxLength - 1)

		// 和点击前 音序条 相同 => 删除
		if (ghost.every((item, index) => item === preTargetData.current[index])) {
			soundList[ghost[0]].blocks.splice(ghost[1], 1)
			setSoundList([...soundList])
			return
		}

		// 移动/拉伸 音序条 => 更新
		const coverBlocks = [block]

		// 处理覆盖部分
		blocks.forEach((item, index) => {
			if (item[0] < block[0] && item[1] >= block[0]) {
				// 左侧重复[2
				blocks.splice(index, 1)
				if (item[1] <= block[1]) {
					// [1, 3][2, 4] => [1, 1][2, 4]
					coverBlocks.push([item[0], block[0] - 1])
				} else {
					// [1, 5][2, 4]=>[1, 2][2, 4][4,5]
					coverBlocks.push([item[0], block[0] - 1], [block[1] + 1, item[1]])
				}
			} else if (item[0] <= block[1] && item[1] > block[1]) {
				// 右侧重复4]
				blocks.splice(index, 1)
				if (item[0] >= block[0]) {
					// [3, 5][2, 4]=>[2, 4][5, 5]
					coverBlocks.push([block[1] + 1, item[1]])
				}
			} else if (item[0] >= block[0] && item[1] <= block[1]) {
				blocks.splice(index, 1)
			}
		})

		onChange?.({ key: soundList[ghost[0]].key, blocks: [block] })
		soundList[ghost[0]].blocks.push(...coverBlocks)
		setSoundList([...soundList])
	}

	/**
	 * 事件处理
	 */
	const onMouseMove = (e: React.MouseEvent) => {
		if (dragable.current === 'drag') {
			// drag模式下更新幽灵音序条位置
			handleDragGhost(e)
		} else if (dragable.current === 'resize') {
			// resize模式下更新幽灵条长度
			handleResizeGhost(e)
		}
	}
	const onMouseDown = (e: React.MouseEvent) => {
		const targetData = (e.target as HTMLElement).dataset.sq
		if (!targetData) {
			return
		}

		// 获取原音序条data
		const [keyIndex, index, type] = targetData.split('-')
		// 获取原音序条block
		const block = soundList[Number(keyIndex)].blocks[Number(index)]

		if (type === 'active') {
			// 音序条拖拽
			dragable.current = 'drag'
			preTargetData.current = [Number(keyIndex), block[0], block[1] - block[0]]

			// 默认幽灵条属性
			ghost[2] = block[1] - block[0]

			// 获取点击音序条初始位置（相对offset）
			const rect = (e.target as HTMLElement).getBoundingClientRect()
			offset.current = [e.clientX - rect.x, e.clientY - rect.y]

			// 以幽灵音序条代替
			handleDragGhost(e)
		} else if (type === 'handler' || type === 'empty') {
			// 音序条handler 或者 空白格拉拽大小
			dragable.current = 'resize'

			// 默认幽灵条属性
			ghost[0] = Number(keyIndex)
			ghost[1] = block ? block[0] : Number(index)

			// 以幽灵音序条代替
			handleResizeGhost(e)
		}
		// 移除原音序条（mouseup事件再将幽灵条还原为音序条）
		soundList[Number(keyIndex)].blocks.splice(Number(index), 1)
		setSoundList([...soundList])
	}
	const onMouseUp = (e: React.MouseEvent) => {
		if (dragable.current) {
			updateSoundList()
			setGhost([-1, 0, 0])
		}
		dragable.current = false
	}
	const dispatch = {
		onMouseMove,
		onMouseDown,
		onMouseUp,
		onMouseLeave: onMouseUp,
	}

	return { dispatch, ghost }
}
