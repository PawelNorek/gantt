import { useState } from 'react'
import { useAddTaskDurationDataMutation } from '../../hooks/queryHooksTaskDurations'
import AddButton from './AddButton'
import styles from './AddTaskDuration.module.css'

export default function AddTaskDuration({ tasks, token }) {
	const [task, setTask] = useState('')
	const [startDate, setStartDate] = useState('2022-01-01')
	const [endDate, setEndDate] = useState('2022-01-03')

	const { mutate: addTaskDuration } = useAddTaskDurationDataMutation()

	function onChange(e) {
		const { value, id } = e.target

		if (id === 'select-task') {
			setTask(value)
		}
		if (id === 'start-date') {
			setStartDate(value)
		}
		if (id === 'end-date') {
			setEndDate(value)
		}
	}

	function handleSubmit(e) {
		e.preventDefault()

		if (task === '') return

		addTaskDuration({
			task: parseInt(task),
			start: startDate,
			end: endDate,
			parent: 0,
			token,
		})
	}

	return (
		<form id='add-task-duration' onSubmit={handleSubmit} className={styles.add_task_duration}>
			<h2>Add Task Duration</h2>
			<div className='inner-form-container'>
				<fieldset id='task' style={{ paddingLeft: '0px' }} className={styles.fieldset}>
					<label htmlFor='select-task' className={styles.fieldset_label}>
						Which task?
					</label>
					<select
						id='select-task'
						name='select-task'
						onChange={onChange}
						value={task}
						onMouseDown={e => e.stopPropagation(e)}>
						<option disabled defaultValue value=''>
							select a task
						</option>
						{tasks &&
							tasks.map(tsk => (
								<option key={tsk?.Id} value={tsk?.Id}>
									{tsk?.name}
								</option>
							))}
						{}
					</select>
				</fieldset>
				<fieldset id='date' className={styles.fieldset}>
					<div className={styles.fieldset_container}>
						<label htmlFor='start-date' className={styles.fieldset_label}>
							Start date:
						</label>
						<input
							type='date'
							id='start-date'
							name='start-date'
							value={startDate}
							min='2022-01-01'
							max='2050-12-31'
							onChange={onChange}
							className={styles.input}
							onMouseDown={e => e.stopPropagation(e)}
						/>
					</div>
					<div style={{ marginLeft: '10px' }} className={styles.fieldset_container}>
						<label htmlFor='end-date' className={styles.fieldset_label}>
							End date:
						</label>
						<input
							type='date'
							id='end-date'
							name='end-date'
							value={endDate}
							min='2022-01-01'
							max='2050-12-31'
							onChange={onChange}
							className={styles.input}
							onMouseDown={e => e.stopPropagation(e)}
						/>
					</div>
				</fieldset>
			</div>
			<AddButton />
		</form>
	)
}
