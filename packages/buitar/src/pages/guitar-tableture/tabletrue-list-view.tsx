import { useState, useEffect } from "react"
import { ModeType, Pitch, Point, getModeRangeTaps,  } from "@buitar/to-guitar"
import { GuitarBoard, Icon, BoardProvider, useBoardContext, getBoardOptionsList, ToneModeController, RangeSliderProps, RangeSlider } from "@/components"
import { useDebounce } from "@/utils/hooks/use-debouce"
import { useStore } from "@/utils/hooks/use-store"
import cx from 'classnames'
import styles from './guitar-tableture.module.scss'

const TABLETURES_KEY = 'tabletures'
const TABLETRUE_CONFIG: TabletrueItemConfig = {
	range: [0, 3],
	mode: 'minor-pentatonic',
	root: 0,
}

/**
 * 指型列表展示
 * @returns
 */
export const GuitarBoardTabletureList = () => {
	const [tabletrues, dispatchTabletrues] = useStore<TabletrueItemConfig[]>(TABLETURES_KEY, [
		TABLETRUE_CONFIG,
	])
	const [isEdit, setIsEdit] = useState<boolean>(false) // 编辑

	// 保存指板option
	const handleSaveTableture = () => {
		setIsEdit(!isEdit)
	}

	return (
		<>
			{/* 编辑模式 */}
			<div
				className={cx(styles['tableture-list-button'], isEdit && 'touch-yellow', 'primary-button')}
				onClick={handleSaveTableture}
			>
				<Icon name={isEdit ? 'icon-confirm' : 'icon-edit'} />
			</div>
			{/* 指板列表 */}
			<div className={cx(styles['tableture-list'], isEdit && styles['tableture-list__edit'])}>
				{tabletrues.map((config, index) => (
					<BoardProvider key={config.mode + index}>
						<GuitarBoardTabletureItem
							range={config.range}
							mode={config.mode}
							root={config.root}
							isEdit={isEdit}
							onRemove={() => {
								tabletrues.splice(index, 1)
								dispatchTabletrues({ type: 'set', payload: tabletrues })
							}}
							onChange={(config) => {
								tabletrues[index] = config
								dispatchTabletrues({ type: 'set', payload: tabletrues })
							}}
						/>
					</BoardProvider>
				))}
			</div>
			{/* 新增指板 */}
			<div
				className={cx(styles['tableture-list-button'], 'primary-button')}
				onClick={() => {
					dispatchTabletrues({ type: 'set', payload: [...tabletrues, TABLETRUE_CONFIG] })
				}}
			>
				<Icon name="icon-add" size={24} />
			</div>
		</>
	)
}

type TabletrueItemConfig = {
	range: [number, number]
	mode: ModeType
	root: Pitch
}

type TabletrueItemProps = TabletrueItemConfig & {
	onChange?(data: TabletrueItemConfig): void
	onRemove?(): void
	isEdit?: boolean
}

/**
 * 获取某和弦匹配的指型
 */
const GuitarBoardTabletureItem = ({
	range: defaultRange = [0, 3],
	mode: defaultMode = 'minor-pentatonic',
	root: defaultRoot = 0,
	isEdit = false,
	onChange,
	onRemove,
}: Partial<TabletrueItemProps>) => {
	const { guitarBoardOption, boardOptions, setTaps, setHighFixedTaps } = useBoardContext()
	const [optionVisible, setOptionVisible] = useState<number>(0)
	const [range, setRange] = useState<TabletrueItemConfig['range']>(defaultRange)
	const [mode, setMode] = useState<TabletrueItemConfig['mode']>(defaultMode)
	const [rootPitch, setRootPitch] = useState<TabletrueItemConfig['root']>(defaultRoot) // 根音
	const deboucedRange = useDebounce(range, 200) // 200ms 防抖 改变range重计算指型
	// pitch转note查看
	const rootNote = getBoardOptionsList(boardOptions)[rootPitch]

	// 编辑：改变根音
	const handleCheckedPoint = (points: Point[]) => {
		if (!isEdit) {
			return
		}
		if (!points) {
			return
		}
		setRootPitch(points[0].tone)
	}
	// 编辑：改变调式
	const handleCheckedMode = (item: ModeType) => {
		setMode(item)
	}

	// 显示指板设置
	const handleCheckedOption = (option: number) => {
		if (option === optionVisible || !isEdit) {
			setOptionVisible(0)
			return
		}
		setOptionVisible(option)
	}

	// 监听变化，更改指型
	useEffect(() => {
		const taps = getModeRangeTaps(rootNote, {
			board: guitarBoardOption.keyboard,
			mode: mode,
			range: deboucedRange,
			ignorePitch: false,
		})
		const highFixedTaps = taps.filter((tap) => tap.tone === rootPitch)
		// 设置指位
		setTaps(taps)
		// 设置根音高亮
		setHighFixedTaps(highFixedTaps)
		// callback
		onChange?.({
			mode,
			range,
			root: rootPitch,
		})
	}, [rootPitch, deboucedRange, mode])

	// 非编辑模式下，不可查看 调式 & 范围 编辑
	useEffect(() => {
		if (!isEdit) {
			setOptionVisible(0)
		}
	}, [isEdit])

	const modeText = mode?.includes('major') ? 'Major' : 'Minor'

	return (
		<div className={styles['tableture-list-item']}>
			<div className={cx(styles['tableture-list-options'])}>
				{/* 调式选择 */}
				<div
					className={cx(
						styles['tableture-options-mode'],
						isEdit && 'touch-yellow',
						'primary-button'
					)}
					onClick={() => handleCheckedOption(1)}
				>
					{rootNote}
					<div className={cx(styles['tableture-options-mode-tag'])}>{modeText}</div>
					{isEdit && (
						<Icon
							name="icon-play"
							className={cx(
								styles['icon-right'],
								optionVisible === 1 && styles['icon-right__extend']
							)}
						/>
					)}
				</div>
				{/* 吉他指板范围选择 */}
				<div
					className={cx(
						styles['tableture-options-range'],
						isEdit && 'touch-yellow',
						'primary-button'
					)}
					onClick={() => handleCheckedOption(2)}
				>
					品数范围 {range[0]} - {range[1]}
					{isEdit && (
						<Icon
							name="icon-play"
							className={cx(
								styles['icon-right'],
								optionVisible === 2 && styles['icon-right__extend']
							)}
						/>
					)}
				</div>
				{/* 删除 */}
				{isEdit && (
					<div
						className={cx(styles['tableture-options-button'], 'touch-purple', 'primary-button')}
						onClick={onRemove}
					>
						<Icon name="icon-delete" />
					</div>
				)}
			</div>

			{optionVisible === 1 && (
				<ToneModeController className={'slide-right-in'} onClick={handleCheckedMode} mode={mode} />
			)}
			{optionVisible === 2 && (
				<GuitarRangeSlider
					className={'slide-right-in'}
					onChange={setRange}
					defaultSize={range[1] - range[0] + 1}
				/>
			)}

			<GuitarBoard range={[range[0], range[1]]} onCheckedPoints={handleCheckedPoint} />
		</div>
	)
}

/**
 * 吉他指板范围选择器
 * @param param0
 * @returns
 */
const GuitarRangeSlider = ({
	onChange,
	className,
	defaultSize = 4,
}: Pick<RangeSliderProps, 'onChange' | 'className'> & { defaultSize?: number }) => {
	const [size, setSize] = useState(defaultSize)
	return (
		<div className={className}>
			<div className={cx(styles['guitar-size-slider'], 'primary-button')}>
				指板宽度 {size}
				<input
					type="range"
					className="primary-range"
					min={2}
					max={8}
					step={0.1}
					defaultValue={size}
					onChange={(e) => setSize(Math.round(Number(e.target.value)))}
				/>
			</div>
			<RangeSlider
				size={size}
				range={[0, 16]}
				onChange={onChange}
				className={cx(styles['guitar-range-slider'])}
			/>
		</div>
	)
}
