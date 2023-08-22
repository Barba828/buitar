import { FC } from 'react'
import { FifthCircleProps, FifthsCircle } from '@/components/fifths-circle'
import { ToneSchema, ModeType } from '@buitar/to-guitar'
import cx from 'classnames'
import { useBoardContext } from '@/components'

import styles from './fifth-circle-controller.module.scss'

export const FifthCircleController: FC<
	{ className?: string; minor?: boolean } & FifthCircleProps
> = (props) => {
	const { guitar } = useBoardContext()

	const handleClickFifths = ({ tone, mode }: { tone: ToneSchema; mode: ModeType }) => {
		if (!tone) {
			return
		}
		guitar.setOptions({ mode, scale: tone.note })
	}

	return (
		<FifthsCircle
			defaultIndex={0}
			size={280}
			thin={50}
			{...props}
			onClick={handleClickFifths}
			className={cx('primary-button', styles['fifth-circle'], props.className)}
		/>
	)
}
