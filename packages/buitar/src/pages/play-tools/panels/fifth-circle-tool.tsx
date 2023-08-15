import { BoardOptionsController, FifthCircleController } from '@/components'
import styles from './fifth-circle-tool.module.scss'

export const FifthCircleTool = () => {
	return (
		<div className={styles['fifth-tool']}>
			<FifthCircleController size={360} thin={60} className={styles['fifth-tool__circle']} />
			<BoardOptionsController list={['isSharpSemitone', 'isNote']} size="small" />
		</div>
	)
}
