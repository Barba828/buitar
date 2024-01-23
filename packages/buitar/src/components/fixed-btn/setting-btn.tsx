import { FC, memo } from 'react'
import { BoardOptionsController, Icon, Popover } from '@/components'
import styles from './setting-btn.module.scss'

export const SettingBtn: FC<React.HTMLAttributes<HTMLButtonElement>> = memo((props) => {
	return (
		<Popover
			trigger={
				<button id="setting-btn" className={props.className}>
					<Icon name="icon-setting" />
				</button>
			}
			placement="top-end"
		>
			<BoardOptionsController className={styles['setting-wrap']} />
		</Popover>
	)
})
