import { BoardController, BoardProvider } from '@/components/guitar-board'
import { FC } from 'react'

import styles from './settings.module.scss'

export const SettingsPage: FC = () => {
	return (
		<BoardProvider>
			<BoardController disableAnimation={true} controllerClassName={styles['board-settings']}/>
		</BoardProvider>
	)
}
