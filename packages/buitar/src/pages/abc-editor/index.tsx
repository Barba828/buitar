import { lazy } from 'react'

const BuitarEditor = lazy(() => import('@buitar/abc-editor'))

export const AbcEditor = () => (
	<div style={{ marginLeft: '-10vw', marginTop: '-10vh' }}>
		<BuitarEditor />
	</div>
)
