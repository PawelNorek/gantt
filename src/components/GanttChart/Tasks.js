import { useEffect, useRef } from 'react'
import styles from './Tasks.module.css'

export default function Tasks({ tasks, setTasks, setTaskDurations }) {
	const inputRef = useRef([])
	const indexRef = useRef(null)

	function handleDelete(e) {
		const idNum = parseInt(e.target.getAttribute('data-task-id'))
		const newTasks = tasks.filter(task => task.Id !== idNum)
		// update state (if data on backend - make API request to update data)
		setTasks(newTasks)

		setTaskDurations(prevState => {
			// delete any taskDurations associated with the task
			const newTaskDurations = prevState.filter(taskDuration => taskDuration.task !== idNum)
			return newTaskDurations
		})
	}

	function onChange(e, i) {
		const { value } = e.target
		const idNum = parseInt(e.target.getAttribute('data-task-id'))

		let newTasks = tasks.filter(task => task.Id !== idNum)

		indexRef.current = i
		newTasks.push({ Id: idNum, name: value })
		newTasks = newTasks.sort((a, b) => a.Id - b.Id)
		// update state (if data on backend - make API request to update data)
		setTasks(newTasks)
	}

	useEffect(() => {
		if (inputRef.current.length && indexRef.current >= 0) {
			inputRef?.current[indexRef.current]?.focus()
		}
	})

	// console.log(setTasks, setTaskDurations);

	// if (tasks.tasks) {
	//   console.log(tasks.tasks);
	// }
	return (
		<div id='gantt-grid-container__tasks' className={styles.gantt_grid_container_tasks}>
			<div className={styles.gantt_task_row}></div>
			<div className={styles.gantt_task_row}></div>
			<div className={styles.gantt_task_row}></div>
			<div className={styles.gantt_task_row}>Income</div>
			<div className={styles.gantt_task_row}>Income Plan vs Real</div>
			<div className={styles.gantt_task_row}>Real</div>
			<div className={styles.gantt_task_row}>Income total</div>
			{tasks &&
				tasks.map((tsk, i) => (
					<div key={`${i}-${tsk?.Id}-${tsk.name}`} className={styles.gantt_task_row}>
						<input
							ref={el => (inputRef.current[i] = el)}
							onChange={e => onChange(e, i)}
							data-task-id={tsk?.Id}
							value={tsk?.name}
							className={styles.input}
						/>
						<button onClick={handleDelete} type='button' data-task-id={tsk?.Id} className={styles.button}>
							X
						</button>
					</div>
				))}
		</div>
	)
}
