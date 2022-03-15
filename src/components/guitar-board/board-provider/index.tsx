import React, { FC, useState } from 'react'
import { Instrument } from '@/utils/tone-player/instrument.type'
import { GuitarBoardOptions } from '../controller.type'

const defaultBoardOptions: GuitarBoardOptions = {
	hasRising: false,
	isRising: true,
	isNote: true,
	hasLevel: false,
}

const defaultInstrument = 'guitar-acoustic'

type BoardContextType = {
	boardOptions: GuitarBoardOptions
	setBoardOptions: SetState<GuitarBoardOptions>
	instrument: Instrument
	setInstrument: SetState<Instrument>
}

const BoardContext = React.createContext<BoardContextType>({} as any)

export const useBoardContext = () => React.useContext(BoardContext)
export const BoardProvider: FC = (props) => {
	const [boardOptions, setBoardOptions] = useState<GuitarBoardOptions>(defaultBoardOptions)
	const [instrument, setInstrument] = useState<Instrument>(defaultInstrument)

	const boardValue = {
		boardOptions,
		setBoardOptions,
		instrument,
		setInstrument,
	}
	return <BoardContext.Provider value={boardValue}>{props.children}</BoardContext.Provider>
}
