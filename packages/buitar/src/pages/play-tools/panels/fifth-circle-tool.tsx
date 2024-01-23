import {
	DegreeChordItem,
	FifthCircleController,
	useBoardContext,
} from '@/components'
import { ControllerList } from '@/components/controller'
import styles from './fifth-circle-tool.module.scss'
import toolsStyles from '../play-tools.module.scss'

export const FifthCircleTool = () => {
	const { guitarBoardOption, boardOptions } = useBoardContext()

	return (
		<div className={styles['fifth-tool']}>
			<div className={toolsStyles['intro-title']}>Fifths Circle</div>
			<FifthCircleController size={360} thin={60} className={styles['fifth-tool__circle']} />
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
