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

export default function GanttChart() {
	let date = new Date()

	const [tasks, setTasks] = useState(null)
	const [taskDurations, setTaskDurations] = useState(null)

	const [timeRange, setTimeRange] = useState({
		fromSelectMonth: date.getMonth(),
		fromSelectYear: date.getFullYear(),
		toSelectMonth: date.getMonth() + 2,
		toSelectYear: date.getFullYear(),
	})
	const [arrows, setArrows] = useState([])

	const { data: tasksData, isPending: isPendingTasks, error: errorTasks } = useFetch(`http://${settings.host}/tasks`)

	const {
		data: arrowData,
		isPending: isPendingArrowData,
		error: errorArrowData,
	} = useFetch(`http://${settings.host}/arrows`)

	const {
		data: taskDurationsData,
		isPending: isPendingTaskDuration,
		error: errorTaskDuration,
	} = useFetch(`http://${settings.host}/taskDurations`)

	useEffect(() => {
		isPendingTasks && <div>Tasks loading...</div>
		errorTasks && <div>{errorTasks}</div>

		tasksData && setTasks(tasksData)
	}, [tasksData, isPendingTasks, errorTasks])

	useEffect(() => {
		isPendingArrowData && <div>Tasks loading...</div>
		errorArrowData && <div>{errorArrowData}</div>

		arrowData && setArrows(arrowData)
	}, [arrowData, errorArrowData, isPendingArrowData])

	useEffect(() => {
		isPendingTaskDuration && <div>Tasks Duration loading...</div>
		errorTaskDuration && <div>{errorTaskDuration}</div>

		taskDurationsData && setTaskDurations(taskDurationsData)
	}, [taskDurationsData, errorTaskDuration, isPendingTaskDuration])

	return (
		<div id='gantt-container'>
			<h1 className='title' onMouseDown={e => e.preventDefault(e)}>
				Gantt Tracker
			</h1>
			<Grid>
				<Tasks tasks={tasks} setTasks={setTasks} setTaskDurations={setTaskDurations} />
				<TasksData tasks={tasks} setTasks={setTasks} setTaskDurations={setTaskDurations} />
				<TimeTable
					timeRange={timeRange}
					tasks={tasks}
					taskDurations={taskDurations}
					setTaskDurations={setTaskDurations}
					arrows={arrows}
				/>
			</Grid>
			<Settings>
				<AddTask setTasks={setTasks} />
				<AddTaskDuration tasks={tasks} setTaskDurations={setTaskDurations} />
				<TimeRange timeRange={timeRange} setTimeRange={setTimeRange} />
			</Settings>
		</div>
	)
}
