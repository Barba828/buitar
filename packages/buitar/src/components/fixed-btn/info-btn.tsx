import { FC, memo, useState, useCallback } from 'react'
import { Icon, Modal } from '@/components'
import { pagesIntroConfig } from '@/pages/pages.config'
import { useRouteMatch } from '@/utils/hooks/use-routers'
import styles from './info-btn.module.scss'

export const InfoBtn: FC<React.HTMLAttributes<HTMLButtonElement>> = memo((props) => {
	const curRoute = useRouteMatch()
	const [infoModalVisible, setInfoModalVisible] = useState<boolean>(false)

	const toggleInfoModalVisible = useCallback(() => {
		setInfoModalVisible(!infoModalVisible)
	}, [infoModalVisible])

	if (!curRoute?.id) {
		return null
	}

	const pageInfo = pagesIntroConfig.get(curRoute.id)

	if (!pageInfo) {
		return null
	}
	const { title, content } = pageInfo

	return (
		<button id="info-btn" className={props.className} onClick={toggleInfoModalVisible}>
			<Icon
				name="icon-more"
				style={{ transform: 'rotate(90deg)' }}
			></Icon>
			<Modal
				visible={infoModalVisible}
				onCancel={toggleInfoModalVisible}
				onConfirm={toggleInfoModalVisible}
			>
				<section className={styles['pages-intro']}>
					<h2>{title}</h2>
					{content.map((item, index) => (
						<p key={index}>{item}</p>
					))}
				</section>
			</Modal>
		</button>
	)
})
