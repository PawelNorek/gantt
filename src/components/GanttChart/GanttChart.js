import { useState, useEffect, useRef } from 'react'
import './GanttChart.css'
import { useFetch } from '../../hooks/useFetch'

import AddTaskDuration from './AddTaskDuration'
import AddTask from './AddTask'
import Grid from './Grid'
import Settings from './Settings'
import Tasks from './Tasks'
import TimeRange from './TimeRange'
import TimeTable from './TimeTable'
import Xarrow, { useXarrow, Xwrapper } from 'react-xarrows'

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

	const { data: tasksData, isPending: isPendingTasks, error: errorTasks } = useFetch('http://192.168.1.191:3000/tasks')

	const {
		data: arrowData,
		isPending: isPendingArrowData,
		error: errorArrowData,
	} = useFetch('http://192.168.1.191:3000/arrows')

	const {
		data: taskDurationsData,
		isPending: isPendingTaskDuration,
		error: errorTaskDuration,
	} = useFetch('http://192.168.1.191:3000/taskDurations')

	useEffect(() => {
		{
			isPendingTasks && <div>Tasks loading...</div>
		}
		{
			errorTasks && <div>{errorTasks}</div>
		}

		tasksData && setTasks(tasksData)
	}, [tasksData])

	useEffect(() => {
		{
			isPendingArrowData && <div>Tasks loading...</div>
		}
		{
			errorArrowData && <div>{errorArrowData}</div>
		}

		arrowData && setArrows(arrowData)
	}, [arrowData])

	useEffect(() => {
		{
			isPendingTaskDuration && <div>Tasks Duration loading...</div>
		}
		{
			errorTaskDuration && <div>{errorTaskDuration}</div>
		}

		taskDurationsData && setTaskDurations(taskDurationsData)
	}, [taskDurationsData])

	return (
		<div id='gantt-container'>
			<Grid>
				<Xwrapper>
					<Tasks tasks={tasks} setTasks={setTasks} setTaskDurations={setTaskDurations} />
					<TimeTable
						timeRange={timeRange}
						tasks={tasks}
						taskDurations={taskDurations}
						setTaskDurations={setTaskDurations}
						arrows={arrows}
					/>
					{/* {tasks && <Xarrow start="0-1" end="2-3" />} */}
				</Xwrapper>
			</Grid>
			{/* {console.log(tasks)} */}
			<Settings>
				<AddTask setTasks={setTasks} />
				<AddTaskDuration tasks={tasks} setTaskDurations={setTaskDurations} />
				<TimeRange timeRange={timeRange} setTimeRange={setTimeRange} />
			</Settings>
		</div>
	)
}
