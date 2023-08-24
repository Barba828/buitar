import { toast } from '@/components'
import { INSTRUMENT_PERCUSSION_KEY } from '@/pages/settings/config/controller.config'
import { useStore } from '@/utils/hooks/use-store'
import { DrumPlayer } from '@buitar/tone-player'
import type { PercussionInstrument } from '@buitar/tone-player'
import { FC, createContext, useContext, useEffect } from 'react'

type DrumContextType = {
	player: DrumPlayer

	instrument: PercussionInstrument
	dispatchInstrument: Dispatch<PercussionInstrument>
}

const DrumBoardContext = createContext<DrumContextType>({} as any)

export const useDrumBoardContext = () => useContext(DrumBoardContext)

export const DrumProvider: FC = (props) => {
	const player = window.drumPlayer as DrumPlayer
	const [instrument, dispatchInstrument] = useStore<PercussionInstrument>(
		INSTRUMENT_PERCUSSION_KEY,
		player.getInstrument() as PercussionInstrument
	)

	// 切换乐器音色：加载乐器音源
	useEffect(() => {
		player.dispatchInstrument(instrument).then(()=>{
			toast('音色加载完成')
		})
	}, [instrument])

	const value = {
		player,
		instrument,
		dispatchInstrument,
	}
	return <DrumBoardContext.Provider value={value}>{props.children}</DrumBoardContext.Provider>
}
