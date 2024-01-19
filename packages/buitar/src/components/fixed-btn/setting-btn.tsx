import { FC, memo, useState, useCallback } from 'react'
import { BoardOptionsController, Icon, Modal } from '@/components'

export const SettingBtn: FC<React.HTMLAttributes<HTMLButtonElement>> = memo((props) => {
	const [settingModalVisible, setSettingModalVisible] = useState<boolean>(false)
	const toggleSettingModalVisible = useCallback(() => {
		setSettingModalVisible(!settingModalVisible)
	}, [settingModalVisible])
	return (
		<button id="setting-btn" className={props.className}>
			<Icon name="icon-setting" onClick={toggleSettingModalVisible} />
			<Modal
				visible={settingModalVisible}
				onCancel={toggleSettingModalVisible}
				onConfirm={toggleSettingModalVisible}
			>
				<BoardOptionsController />
			</Modal>
		</button>
	)
})
