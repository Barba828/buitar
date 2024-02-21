import { useIsMobile } from '@/utils/hooks/use-device'
import { lazy } from 'react'

const BuitarEditor = lazy(() => import('@buitar/abc-editor'))

export const AbcEditor = () => {
	const isMobile = useIsMobile()
	return (
		<div style={{ marginLeft: isMobile ? '-20px' : '-10vw' }}>
			<BuitarEditor />
		</div>
	)
}
