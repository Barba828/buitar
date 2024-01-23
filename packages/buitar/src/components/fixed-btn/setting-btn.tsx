import { FC, memo, useState, useCallback } from 'react'
import { BoardOptionsController, Icon, Portal } from '@/components'

export const SettingBtn: FC<React.HTMLAttributes<HTMLButtonElement>> = memo((props) => {
	const [settingModalVisible, setSettingModalVisible] = useState<boolean>(false)
	const toggleSettingModalVisible = useCallback(() => {
		setSettingModalVisible(!settingModalVisible)
	}, [settingModalVisible])
	return (
		<button id="setting-btn" className={props.className}>
			<Portal trigger={<Icon name="icon-setting" onClick={toggleSettingModalVisible} />}>
				<BoardOptionsController />
			</Portal>
		</button>
	)
})
