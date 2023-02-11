//creates first column of chart

import { useEffect, useRef } from 'react'
import styles from './Tasks.module.css'
import {
	// useDeleteTaskDurationDataMutation,
	// useDeleteTasksDataMutation,
	// useUpdateTasksDataMutation,
} from '../../hooks/queryHooks'
import { addTasksData, deleteTaskDurationData, deleteTasksData, patchTasksData } from '../../api/dataQuery'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Tasks({ tasks, taskDurations, token }) {

	const inputRef = useRef([])
	const indexRef = useRef(null)

	const queryClient = useQueryClient()

	// const updateTasksData = useUpdateTasksDataMutation()

	const useUpdateTasksDataMutation = useMutation({
		mutationFn: ({ Id, task, name, value, token }) => patchTasksData(Id, task, name, value, token),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['tasks'] })
		},
	})

	const useAddTasksDataMutation = useMutation({
		mutationFn: ({ task, name, value, token }) => addTasksData(task, name, value, token),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['tasks'] })
		},
	})

	// const deleteTasksData = useDeleteTasksDataMutation()

	const useDeleteTasksDataMutation = useMutation({
		mutationFn: ({ Id, token }) => deleteTasksData(Id, token),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
	})

	// const deleteTaskDurationData = useDeleteTaskDurationDataMutation()

	const useDeleteTaskDurationDataMutation = useMutation({
		mutationFn: ({ Id, token }) => deleteTaskDurationData(Id, token),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['taskDurations'] }),
	})

	function handleDelete(e) {
		const idNum = parseInt(e.target.getAttribute('data-task-id'))

		//to delete task user need to press X button
		//task is deleted using mutation and corresponding task id number
		//taskToBeDel_task will store corresponding task number from tasks table
		const taskToBeDel_task = tasks.filter(task => task.Id === idNum)[0].task

		//to delete task duration we need to know id of that task duration in its table
		//to find it we need to take task number and using it find proper row which needs to be deleted
		//taskDurationToBeDel will store table filtered from taskDurations which will hold whole task duration (will be empty - length equal to 0 - if task duration does not exists for particular task)
		//from that we will need to find id of row which needs to be deleted
		const taskDurationToBeDel = taskDurations.filter(row => row.task === taskToBeDel_task)

		// console.log(taskToBeDel_task, taskDurationToBeDel, taskDurationToBeDel[0].Id)

		if (taskDurationToBeDel.length !== 0) {
			useDeleteTaskDurationDataMutation.mutate({
			// deleteTaskDurationData.mutate({
				Id: taskDurationToBeDel[0].Id,
				token: token,
			})
		}
		useDeleteTasksDataMutation.mutate({
			Id: idNum,
			token: token,
		})
	}

	function handleAddTask (e) {
		// const idNum = parseInt(e.target.getAttribute('data-task-id'))

		useAddTasksDataMutation.mutate({
			task: 22,
			name: 'test',
			value: 123,
			token: token,
		})

		toast.info('Task added');
	}

	function onChange(e, i) {
		const { value } = e.target
		const idNum = parseInt(e.target.getAttribute('data-task-id'))

		indexRef.current = i
		useUpdateTasksDataMutation.mutate({
			Id: idNum,
			name: value,
			token: token,
		})
	}

	useEffect(() => {
		if (inputRef.current.length && indexRef.current >= 0) {
			inputRef?.current[indexRef.current]?.focus()
		}
	})

	return (
		<div id='gantt-grid-container__tasks' className={styles.gantt_grid_container_tasks}>
			<ToastContainer/>
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
						{/* {tsk?.type !== 'place_holder' && ( */}
							<input
								ref={el => (inputRef.current[i] = el)}
								onChange={e => onChange(e, i)}
								data-task-id={tsk?.Id}
								value={tsk?.name}
								className={styles.input}
								onMouseDown={e => e.stopPropagation(e)}
							/>
						{/* )} */}
						{tsk?.type !== 'place_holder' && (
							<button onClick={handleDelete} type='button' data-task-id={tsk?.Id} className={styles.button} onMouseUp={(e)=>e.stopPropagation(e)}>
							✖️
							</button>
						)}
						{tsk?.type === 'place_holder' && (
							<button onClick={handleAddTask} type='button' data-task-id={tsk?.Id} className={styles.button} onMouseUp={(e)=>e.stopPropagation(e)}>
							➕
							</button>
						)}
					</div>
				))}
		</div>
	)
}
