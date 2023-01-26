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

export default function GanttChart({ token }) {
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

	const options = {
		method: 'GET',
		headers: {
			'xc-auth': token,
		},
	}

	// console.log(token)

	const {
		data: tasksData,
		isPending: isPendingTasks,
		error: errorTasks,
	} = useFetch(
		`https://${settings.host}/api/v1/db/data/noco/p_ms46kiyconfhxk/tasks/views/tasks?offset=0&limit=25&where=`,
		options
	)

	// const { data: tasksData, isPending: isPendingTasks, error: errorTasks } = useFetch(`http://${settings.host}/tasks`)

	const {
		data: arrowData,
		isPending: isPendingArrowData,
		error: errorArrowData,
	} = useFetch(
		`https://${settings.host}/api/v1/db/data/noco/p_ms46kiyconfhxk/arrows/views/arrows?offset=0&limit=25&where=`,
		options
	)

	const {
		data: taskDurationsData,
		isPending: isPendingTaskDuration,
		error: errorTaskDuration,
	} = useFetch(
		`https://${settings.host}/api/v1/db/data/noco/p_ms46kiyconfhxk/task_durations/views/task_durations?offset=0&limit=25&where=`,
		options
	)

	useEffect(() => {
		tasksData && setTasks(tasksData.list)
	}, [tasksData, errorTasks, isPendingTasks])

	useEffect(() => {
		arrowData && setArrows(arrowData.list)
	}, [arrowData, errorArrowData, isPendingArrowData])

	useEffect(() => {
		taskDurationsData && setTaskDurations(taskDurationsData.list)
	}, [taskDurationsData, errorTaskDuration, isPendingTaskDuration])

	return (
		<div id='gantt-container'>
			{(isPendingArrowData || isPendingTaskDuration || isPendingTasks) && <div>Loading</div>}
			{(errorTasks || errorArrowData || errorTaskDuration) && <div>{errorTasks}</div>}
			{tasksData && arrowData && taskDurationsData && (
				<>
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
				</>
			)}
		</div>
	)
}
