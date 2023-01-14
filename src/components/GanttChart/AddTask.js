import { useState } from 'react'
import AddButton from './AddButton'
import './AddTask.css'

export default function AddTask({ setTasks }) {
	const [task, setTask] = useState('')

	function onChange(e) {
		setTask(e.target.value)
	}

	function handleSubmit(e) {
		e.preventDefault()
		setTasks(prevState => {
			const newState = prevState
			// find largest task number, add 1 for new task - else could end up with tasks with same id
			const maxIdVal = prevState.reduce(function (a, b) {
				return Math.max(a, b.id)
			}, -Infinity)

			// create new task
			newState.push({
				id: isFinite(maxIdVal) ? maxIdVal + 1 : 1,
				name: task,
			})

			return [...newState]
		})
		setTask('')
	}

	return (
		<form id='add-task' onSubmit={handleSubmit}>
			<h2>Add Task</h2>
			<input value={task} onChange={onChange} placeholder='add task name' />
			<AddButton />
		</form>
	)
}
