import { useState } from 'react'
import './GanttChart.css'
import AddTaskDuration from './AddTaskDuration'
// import AddTask from './AddTask'
import Grid from './Grid'
import Settings from './Settings'
import Tasks from './Tasks'
import TasksData from './TasksData'
import TimeRange from './TimeRange'
import TimeTable from './TimeTable'
import { useTaskDurationDataQuery, useTasksDataQuery } from '../../hooks/queryHooks'
import { useEffect } from 'react'

export default function GanttChart({ token, setToken }) {
	let date = new Date()

	const [timeRange, setTimeRange] = useState({
		fromSelectMonth: date.getMonth(),
		fromSelectYear: date.getFullYear(),
		toSelectMonth: date.getMonth() + 2,
		toSelectYear: date.getFullYear(),
	})

	const { data: tasks, isLoading: isPendingTasks, error: errorTasks } = useTasksDataQuery(token)

	useEffect(() => {
		const cookieValue = document.cookie
			.split('; ')
			.find(row => row.startsWith('gantt-cookie='))
			?.split('=')[1]
		if (cookieValue) {
			setToken(cookieValue)
		}
	}, [setToken])

	// let setTaskDurations = ''

	const {
		data: taskDurations,
		isLoading: isPendingTaskDuration,
		error: errorTaskDuration,
	} = useTaskDurationDataQuery(token)

	return (
		<div id='gantt-container'>
			{(isPendingTaskDuration || isPendingTasks) && <div>Loading</div>}
			{(errorTasks || errorTaskDuration) && <div>{errorTasks}</div>}
			{tasks && taskDurations && (
				<>
					<h1 className='title' onMouseDown={e => e.preventDefault(e)}>
						Gantt Tracker
					</h1>
					<Grid>
						<Tasks
							tasks={tasks.list.sort((a, b) => (a.order > b.order ? 1 : -1))}
							taskDurations={taskDurations.list}
							token={token}
						/>
						<TasksData tasks={tasks.list.sort((a, b) => (a.order > b.order ? 1 : -1))} />
						<TimeTable
							timeRange={timeRange}
							tasks={tasks.list.sort((a, b) => (a.order > b.order ? 1 : -1))}
							taskDurations={taskDurations.list}
							token={token}
						/>
					</Grid>
					<Settings>
						{/* <AddTask setTasks={setTasks} /> */}
						<AddTaskDuration tasks={tasks.list} token={token} />
						<TimeRange timeRange={timeRange} setTimeRange={setTimeRange} />
					</Settings>
				</>
			)}
		</div>
	)
}
