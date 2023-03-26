import { useState } from 'react'
import './GanttChart.css'
import AddTaskDuration from '../GanttChart/AddTaskDuration'
// import AddTask from './AddTask'
import Grid from '../GanttChart/Grid'
import Settings from '../GanttChart/Settings'
import Tasks from '../GanttChart/Tasks'
import TasksData from '../GanttChart/TasksData'
import TimeRange from '../GanttChart/TimeRange'
import TimeTable from './TimeTable'
import { useTasksDataQuery } from '../../hooks/queryHooksTasks'
import { useTaskDurationDataQuery } from '../../hooks/queryHooksTaskDurations'
import { useEffect } from 'react'
import { getWeekDatesString } from '../../helpers/dateFunctions'
import { monthsPol } from '../../constants'

export default function GanttChart({ token, setToken }) {
	let date = new Date()

	const [timeRange, setTimeRange] = useState({
		fromSelectMonth: date.getMonth(),
		fromSelectYear: date.getFullYear(),
		toSelectMonth: date.getMonth() + 2,
		toSelectYear: date.getFullYear(),
	})

	const [weeksTable, setWeeksTable] = useState([])

	useEffect(() => {
		const tempWeeksTable = []
		let weekString = ''
		const dateYear = new Date().getFullYear()
		for (let i = 1; i < 55; i++) {
			weekString = getWeekDatesString(i, dateYear, 5)
			tempWeeksTable.push({ week: i, month: monthsPol[Number(weekString.slice(2, 4)) - 1], weekString: weekString })
		}
		setWeeksTable(tempWeeksTable)
	}, [])

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
						{/* <div></div> */}
						{/* <div></div> */}
						<Tasks
							tasks={tasks.list.sort((a, b) => (a.order > b.order ? 1 : -1))}
							taskDurations={taskDurations.list}
							token={token}
						/>
						<TasksData tasks={tasks.list.sort((a, b) => (a.order > b.order ? 1 : -1))} />
						<TimeTable
							weeksTable={weeksTable}
							// timeRange={timeRange}
							tasks={tasks.list.sort((a, b) => (a.order > b.order ? 1 : -1))}
							taskDurations={taskDurations.list}
							token={token}
						/>
					</Grid>
					{/* <Settings> */}
					{/* <AddTask setTasks={setTasks} /> */}
					{/* <AddTaskDuration tasks={tasks.list} token={token} /> */}
					{/* <TimeRange timeRange={timeRange} setTimeRange={setTimeRange} /> */}
					{/* </Settings> */}
				</>
			)}
		</div>
	)
}
