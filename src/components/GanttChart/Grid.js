import styles from './Grid.module.css'

export default function Grid({ children }) {
	return (
		<div id='gantt-grid-container' className={styles.gantt_grid_container}>
			{children}
		</div>
	)
}
