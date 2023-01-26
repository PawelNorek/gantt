import { useEffect, useRef } from 'react'
import styles from './TasksData.module.css'

export default function TasksData({ tasks }) {
	const inputRef = useRef([])
	const indexRef = useRef(null)

	useEffect(() => {
		if (inputRef.current.length && indexRef.current >= 0) {
			inputRef?.current[indexRef.current]?.focus()
		}
	})

	return (
		<div id='gantt-grid-container__tasks' className={styles.gantt_grid_container_tasks}>
			<div className={styles.gantt_task_row}></div>
			<div className={styles.gantt_task_row}></div>
			<div className={styles.gantt_task_row}></div>
			<div className={styles.gantt_task_row}>TBD</div>
			<div className={styles.gantt_task_row}>TBD</div>
			<div className={styles.gantt_task_row}>TBD</div>
			<div className={styles.gantt_task_row}>TBD</div>
			{tasks &&
				tasks.map((tsk, i) => (
					<div key={`${i}-${tsk?.Id}-${tsk.name}`} className={styles.gantt_task_row}>
						<table className={styles.table}>
							<tbody>
								<tr>
									<td>{tsk?.value}</td>
								</tr>
							</tbody>
						</table>
					</div>
				))}
		</div>
	)
}
