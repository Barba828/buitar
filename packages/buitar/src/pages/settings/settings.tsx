import { BoardController, BoardProvider } from '@/components/guitar-board'
import { FC } from 'react'

import styles from './settings.module.scss'

export const SettingsPage: FC = () => {
	return (
		<BoardProvider>
			<BoardController
				controllerClassName={styles['board-settings']}
				scrollable={false}
				size="large"
				visible={true}
			/>
		</BoardProvider>
	)
}
