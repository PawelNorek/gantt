//creates first column of chart

import { useEffect, useRef, useState } from 'react'
import styles from './Tasks.module.css'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { DragDropContext, Draggable } from 'react-beautiful-dnd'
import { StrictModeDroppable as Droppable } from '../../helpers/StrictModeDroppable'
import {
	useAddTasksDataMutation,
	useDeleteTaskDurationDataMutation,
	useDeleteTasksDataMutation,
	useUpdateTasksDataMutation,
	useUpdateTasksDataMutationBulk,
} from '../../hooks/queryHooks'
import { useQueryClient } from '@tanstack/react-query'

export default function Tasks({ tasks, taskDurations, token }) {
	const inputRef = useRef([])
	const indexRef = useRef(null)

	const queryClient = useQueryClient()

	const [taskAddValue, setTaskAddValue] = useState('')

	const { mutate: updateTasksData } = useUpdateTasksDataMutation()

	const { mutate: updataTasksDataBulk } = useUpdateTasksDataMutationBulk()

	const { mutate: addTasksData } = useAddTasksDataMutation()

	const { mutate: deleteTasksData } = useDeleteTasksDataMutation()

	const { mutate: deleteTaskDurationData } = useDeleteTaskDurationDataMutation()

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

		if (taskDurationToBeDel.length !== 0) {
			deleteTaskDurationData({
				Id: taskDurationToBeDel[0].Id,
				token: token,
			})
		}

		deleteTasksData({
			Id: idNum,
			token: token,
		})
		toast.info('Task deleted')
	}

	function handleAddTask(value) {
		const highestTaskOrderNumber = Math.max(
			...tasks.filter(task => task.type !== 'place_holder').map(task => task.order)
		)

		addTasksData(
			{
				task: 22,
				name: taskAddValue,
				value: 123,
				order: highestTaskOrderNumber + 1,
				token: token,
			},
			{
				onSuccess: () => {
					setTaskAddValue('')
				},
			}
		)

		toast.info('Task added')
		const idOfPlaceHolder = tasks.filter(task => task.type === 'place_holder')[0].Id

		updateTasksData({
			Id: idOfPlaceHolder,
			order: highestTaskOrderNumber + 2,
			token: token,
		})
	}

	function handleOnDragEnd(result) {
		if (!result.destination) return

		//TODO Here we need to update position values on the list

		// console.log('Result:', result)
		const tasksTemporary = [...tasks]

		const [reorderedItem] = tasksTemporary.splice(result.source.index, 1)
		tasksTemporary.splice(result.destination.index, 0, reorderedItem)

		let order = 0
		const tempArray = []

		tasksTemporary.forEach(task => {
			order += 1
			tempArray.push({ Id: task.Id, order })
		})

		queryClient.setQueryData({ queryKey: ['tasks', tasks.value], tasksTemporary })

		// queryClient.setQueryData(old => [
		// 	...old,
		// 	tasksTemporary.map(task => (task.Id === 334 ? (task.order = 125) : task.order)),
		// ])

		updataTasksDataBulk({ data: tempArray, token })

		// console.log('reordered:', reorderedItem)
		// console.log('Tasks temporary:', tasksTemporary)
	}

	function handelOnKeyDown(event, cellType) {
		const { value } = event.target
		const idNum = parseInt(event.target.getAttribute('data-task-id'))

		if (cellType === 'place_holder') {
			setTaskAddValue(value)
		}

		if (event.key === 'Enter') {
			if (cellType === 'data') {
				updateTasksData({
					Id: idNum,
					name: value,
					token: token,
				})
			} else {
				handleAddTask()
			}
		}
	}

	function notPlace_holderEntry(task, i) {
		return (
			<>
				<p onMouseUp={e => e.stopPropagation(e)} style={{ marginTop: 7, cursor: 'grab', transition: 'all 0.2s ease' }}>
					↕️↕️
				</p>
				<input
					ref={el => (inputRef.current[i] = el)}
					onKeyDown={e => handelOnKeyDown(e, 'data')}
					data-task-id={task?.Id}
					defaultValue={task?.name}
					className={styles.input}
					onMouseDown={e => e.stopPropagation(e)}
				/>
				<button
					onClick={handleDelete}
					type='button'
					data-task-id={task?.Id}
					className={styles.button}
					onMouseUp={e => e.stopPropagation(e)}>
					✖️
				</button>
			</>
		)
	}

	function place_holderEntry(task, i) {
		return (
			<>
				<input
					ref={el => (inputRef.current[i] = el)}
					onKeyDown={e => handelOnKeyDown(e, 'place_holder')}
					onChange={e => handelOnKeyDown(e, 'place_holder')}
					data-task-id={task?.Id}
					value={taskAddValue}
					className={styles.input}
					onMouseDown={e => e.stopPropagation(e)}
				/>
				{taskAddValue && (
					<button
						onClick={handleAddTask}
						type='button'
						data-task-id={task?.Id}
						className={styles.button}
						onMouseUp={e => e.stopPropagation(e)}>
						➕
					</button>
				)}
			</>
		)
	}

	useEffect(() => {
		if (inputRef.current.length && indexRef.current >= 0) {
			inputRef?.current[indexRef.current]?.focus()
		}
	})

	return (
		<div id='gantt-grid-container__tasks' className={styles.gantt_grid_container_tasks}>
			<ToastContainer />
			<div className={styles.gantt_task_row}></div>
			<div className={styles.gantt_task_row}></div>
			<div className={styles.gantt_task_row}></div>
			<div className={styles.gantt_task_row}>Income</div>
			<div className={styles.gantt_task_row}>Income Plan vs Real</div>
			<div className={styles.gantt_task_row}>Real</div>
			<div className={styles.gantt_task_row}>Income total</div>
			{tasks && (
				<DragDropContext onDragEnd={handleOnDragEnd}>
					<Droppable droppableId='tasks'>
						{provided => (
							<section {...provided.droppableProps} ref={provided.innerRef}>
								{tasks.map((tsk, i) => (
									<Draggable key={`${i}-${tsk?.Id}-${tsk.name}`} draggableId={`${tsk?.Id}`} index={i}>
										{provided => (
											<div
												{...provided.draggableProps}
												{...provided.dragHandleProps}
												ref={provided.innerRef}
												className={styles.gantt_task_row}>
												{tsk?.type !== 'place_holder' && notPlace_holderEntry(tsk, i)}
												{tsk?.type === 'place_holder' && place_holderEntry(tsk, i)}
											</div>
										)}
									</Draggable>
								))}
								{provided.placeholder}
							</section>
						)}
					</Droppable>
				</DragDropContext>
			)}
		</div>
	)
}
