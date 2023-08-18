import {
	BoardOptionsController,
	DegreeChordItem,
	FifthCircleController,
	useBoardContext,
} from '@/components'
import styles from './fifth-circle-tool.module.scss'
import { ControllerList } from '@/components/controller'

export const FifthCircleTool = () => {
	const { guitarBoardOption, boardOptions } = useBoardContext()

	return (
		<div className={styles['fifth-tool']}>
			<FifthCircleController size={360} thin={60} className={styles['fifth-tool__circle']} />
			<BoardOptionsController list={['isSharpSemitone', 'isNote']} />
			<ControllerList
				list={guitarBoardOption.chords || []}
				renderListItem={(item) => (
					<DegreeChordItem
						item={item}
						withtag={false}
						isSharpSemitone={boardOptions.isSharpSemitone}
					/>
				)}
				extendItem={true}
				scrollable={true}
			/>
		</div>
	)
}
