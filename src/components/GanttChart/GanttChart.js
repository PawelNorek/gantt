import { useState, useEffect } from 'react'
import './GanttChart.css'
import { useFetch } from '../../hooks/useFetch'
import settings from '../../settings'

import AddTaskDuration from './AddTaskDuration'
import AddTask from './AddTask'
import Grid from './Grid'
import Settings from './Settings'
import Tasks from './Tasks'
import TasksData from './TasksData'
import TimeRange from './TimeRange'
import TimeTable from './TimeTable'
import { getArrowData, getTaskData, getTaskDurationData } from '../../api/dataQuery'
import { useQuery } from '@tanstack/react-query'

export default function GanttChart({ token }) {
	let date = new Date()

	// const [tasks, setTasks] = useState(null)
	// const [taskDurations, setTaskDurations] = useState(null)

	const [timeRange, setTimeRange] = useState({
		fromSelectMonth: date.getMonth(),
		fromSelectYear: date.getFullYear(),
		toSelectMonth: date.getMonth() + 2,
		toSelectYear: date.getFullYear(),
	})
	// const [arrows, setArrows] = useState([])

	const options = {
		method: 'GET',
		headers: {
			'xc-auth': token,
		},
	}

	const {
		data: tasks,
		isLoading: isPendingTasks,
		error: errorTasks,
	} = useQuery({
		queryKey: ['tasks'],
		queryFn: () => getTaskData(token),
		enabled: token !== '' && token !== undefined,
	})

	// console.log(token)

	// const {
	// 	data: tasksData,
	// 	isPending: isPendingTasks,
	// 	error: errorTasks,
	// } = useFetch(
	// 	`https://${settings.host}/api/v1/db/data/noco/p_ms46kiyconfhxk/tasks/views/tasks?offset=0&limit=25&where=`,
	// 	options
	// )

	// const { data: tasksData, isPending: isPendingTasks, error: errorTasks } = useFetch(`http://${settings.host}/tasks`)

	let setTasks = ''
	let setTaskDurations = ''

	// console.log(tasks)

	const {
		data: arrows,
		isLoading: isPendingArrowData,
		error: errorArrowData,
	} = useQuery({
		queryKey: ['arrows'],
		queryFn: () => getArrowData(token),
		enabled: token !== '' && token !== undefined,
	})

	// const {
	// 	data: arrowData,
	// 	isPending: isPendingArrowData,
	// 	error: errorArrowData,
	// } = useFetch(
	// 	`https://${settings.host}/api/v1/db/data/noco/p_ms46kiyconfhxk/arrows/views/arrows?offset=0&limit=25&where=`,
	// 	options
	// )

	const {
		data: taskDurations,
		isLoading: isPendingTaskDuration,
		error: errorTaskDuration,
	} = useQuery({
		queryKey: ['taskDurations'],
		queryFn: () => getTaskDurationData(token),
		enabled: token !== '' && token !== undefined,
	})

	// const {
	// 	data: taskDurationsData,
	// 	isPending: isPendingTaskDuration,
	// 	error: errorTaskDuration,
	// } = useFetch(
	// 	`https://${settings.host}/api/v1/db/data/noco/p_ms46kiyconfhxk/task_durations/views/task_durations?offset=0&limit=25&where=`,
	// 	options
	// )

	// useEffect(() => {
	// 	tasksData && setTasks(tasksData.list)
	// }, [tasksData, errorTasks, isPendingTasks])

	// useEffect(() => {
	// 	arrowData && setArrows(arrowData.list)
	// }, [arrowData, errorArrowData, isPendingArrowData])

	// useEffect(() => {
	// 	taskDurationsData && setTaskDurations(taskDurationsData.list)
	// }, [taskDurationsData, errorTaskDuration, isPendingTaskDuration])

	return (
		<div id='gantt-container'>
			{(isPendingArrowData || isPendingTaskDuration || isPendingTasks) && <div>Loading</div>}
			{(errorTasks || errorArrowData || errorTaskDuration) && <div>{errorTasks}</div>}
			{tasks && arrows && taskDurations && (
				<>
					<h1 className='title' onMouseDown={e => e.preventDefault(e)}>
						Gantt Tracker
					</h1>
					<Grid>
						<Tasks tasks={tasks.list} setTasks={setTasks} setTaskDurations={setTaskDurations} />
						<TasksData tasks={tasks.list} setTasks={setTasks} setTaskDurations={setTaskDurations} />
						<TimeTable
							timeRange={timeRange}
							tasks={tasks.list}
							taskDurations={taskDurations.list}
							setTaskDurations={setTaskDurations}
							arrows={arrows.list}
						/>
					</Grid>
					<Settings>
						<AddTask setTasks={setTasks} />
						<AddTaskDuration tasks={tasks.list} setTaskDurations={setTaskDurations} />
						<TimeRange timeRange={timeRange} setTimeRange={setTimeRange} />
					</Settings>
				</>
			)}
		</div>
	)
}
