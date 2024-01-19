import { FC } from 'react'
import { AudioBtn } from './audio-btn'
import { SettingBtn } from './setting-btn'

import styles from './fixed-btns.module.scss'

export const FixedBtns: FC<{}> = () => {
	return (
		<div className={styles['btn-group']}>
			<AudioBtn className={styles['btn']}></AudioBtn>
			<SettingBtn className={styles['btn']}></SettingBtn>
		</div>
	)
}
