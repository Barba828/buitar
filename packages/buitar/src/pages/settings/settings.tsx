import {
	BoardController,
	BoardProvider,
	InstrumentKeyboardKey,
	useBoardContext,
} from '@/components/guitar-board'
import { FC } from 'react'
import { ControllerList } from '@/components/controller'

import styles from './settings.module.scss'
import { instrumentKeyboardConfig } from './config/controller.config'

export const SettingsPage: FC = () => {
	return (
		<BoardProvider>
			<BoardController
				controllerClassName={styles['board-settings']}
				scrollable={false}
				size="large"
				ignore={true}
			/>
			<KeyBoardInstrument />
		</BoardProvider>
	)
}

export const KeyBoardInstrument: FC = () => {
	const { instrumentKeyboard, dispatchInstrumentKeyboard } = useBoardContext()
	return (
		<ControllerList
			list={Object.keys(instrumentKeyboardConfig) as InstrumentKeyboardKey[]}
			renderListItem={(key) => <>{instrumentKeyboardConfig[key].name}</>}
			onClickItem={(key) => dispatchInstrumentKeyboard({ type: 'set', payload: key })}
			checkedItem={(key) => key === instrumentKeyboard}
			scrollable={false}
			size="large"
		></ControllerList>
	)
}
