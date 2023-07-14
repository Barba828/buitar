import React, { FC, useEffect } from 'react'
import { BoardProvider } from '@/components/guitar-board'
import { usePagesIntro } from '@/components'

export const GuitarTableture: FC = () => {
	const intro = usePagesIntro()

	return <BoardProvider>{intro}</BoardProvider>
}
