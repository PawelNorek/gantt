import { useEffect, useRef } from 'react'
import './Tasks.css'

export default function Tasks({ tasks, setTasks, setTaskDurations }) {
	const inputRef = useRef([])
	const indexRef = useRef(null)

	function handleDelete(e) {
		const idNum = parseInt(e.target.getAttribute('data-task-id'))
		const newTasks = tasks.filter(task => task.id !== idNum)
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

		let newTasks = tasks.filter(task => task.id !== idNum)

		indexRef.current = i
		newTasks.push({ id: idNum, name: value })
		newTasks = newTasks.sort((a, b) => a.id - b.id)
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
		<div id='gantt-grid-container__tasks'>
			<div className='gantt-task-row'></div>
			<div className='gantt-task-row'></div>
			<div className='gantt-task-row'></div>
			{tasks &&
				tasks.map((tsk, i) => (
					<div key={`${i}-${tsk?.id}-${tsk.name}`} className='gantt-task-row'>
						<input
							ref={el => (inputRef.current[i] = el)}
							onChange={e => onChange(e, i)}
							data-task-id={tsk?.id}
							value={tsk?.name}
						/>
						<button onClick={handleDelete} type='button' data-task-id={tsk?.id}>
							x
						</button>
						<p className='gantt-task-row'>{tsk?.value}</p>
					</div>
				))}
		</div>
	)
}
