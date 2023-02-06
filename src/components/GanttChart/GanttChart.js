import { useState } from 'react'
import './GanttChart.css'
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
import { useArrowDataQuery, useTaskDurationDataQuery, useTasksDataQuery } from '../../hooks/queryHooks'

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

	const { data: tasks, isLoading: isPendingTasks, error: errorTasks } = useTasksDataQuery(token)

	let setTasks = ''
	let setTaskDurations = ''

	const { data: arrows, isLoading: isPendingArrowData, error: errorArrowData } = useArrowDataQuery(token)

	const {
		data: taskDurations,
		isLoading: isPendingTaskDuration,
		error: errorTaskDuration,
	} = useTaskDurationDataQuery(token)

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
							token={token}
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
