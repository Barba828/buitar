import { FC } from 'react'
import { AudioBtn } from './audio-btn'
import { SettingBtn } from './setting-btn'
import { InfoBtn } from './info-btn'

import styles from './fixed-btns.module.scss'

export const FixedBtns: FC<{}> = () => {
	return (
		<div className={styles['btn-group']}>
			<AudioBtn className={styles['btn']}></AudioBtn>
			<InfoBtn className={styles['btn']}></InfoBtn>
			<SettingBtn className={styles['btn']}></SettingBtn>
		</div>
	)
}
