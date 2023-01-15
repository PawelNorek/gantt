import styles from './Settings.module.css'

export default function Settings({ children }) {
	return (
		<div id='settings' className={styles.settings}>
			{children}
		</div>
	)
}
