import { BoardController } from '@/components/guitar-board'
import { FC } from 'react'
import styles from './settings.module.scss'

export const SettingsPage: FC = () => {
	return (
		<>
			<BoardController
				controllerClassName={styles['board-settings']}
				scrollable={false}
				size="large"
			/>
		</>
	)
}
