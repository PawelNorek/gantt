import { useState } from 'react'
import styles from './TimeTable.module.css'
import {
	monthDiff,
	getDaysInMonth,
	getDayOfWeek,
	createFormattedDateFromStr,
	dayDiff,
} from '../../helpers/dateFunctions'
import { months } from '../../constants'
import { useUpdateTaskDurationDataMutation } from '../../hooks/queryHooks'
import { RenderArrows } from './RenderArrows'

// export default function TimeTable({ timeRange, tasks, taskDurations, setTaskDurations, arrows, token }) {
export default function TimeTable({ weeksTable, timeRange, tasks, taskDurations, token }) {
	// for dynamic css styling
	const ganttTimePeriod = {
		display: 'grid',
		gridAutoFlow: 'column',
		gridAutoColumns: 'minmax(30px, 1fr)',
		outline: '0.5px solid var(--color-outline)',
		textAlign: 'center',
		height: 'var(--cell-height)',
	}

	const ganttTimePeriodSpan = {
		margin: 'auto',
	}

	const ganttTimePeriodCell = {
		position: 'relative',
		outline: '0.5px solid var(--color-outline)',
		marginTop: '0.5px',
	}

	const taskDuration = {
		position: 'relative',
		height: 'calc(var(--cell-height) - 1px)',
		zIndex: '1',
		background: 'linear-gradient(90deg, var(--color-primary-light) 0%, var(--color-primary-dark) 100%)',
		borderRadius: 'var(--border-radius)',
		boxShadow: '3px 3px 3px rgba(0, 0, 0, 0.05)',
		cursor: 'move',
	}

	// creating rows
	const startMonth = new Date(parseInt(timeRange.fromSelectYear), timeRange.fromSelectMonth)
	const endMonth = new Date(parseInt(timeRange.toSelectYear), timeRange.toSelectMonth)
	const numMonths = monthDiff(startMonth, endMonth) + 1
	let month = new Date(startMonth)

	const [taskDurationUnderMouseid, setTaskDurationUnderMouseid] = useState(null)
	const [manipulationModeOn, setManipulationModeOn] = useState(0)
	const [taskData, setTaskData] = useState([])
	const [leftManipulation, setLeftManipulation] = useState(false)
	const [rightManipulation, setRightManipulation] = useState(false)

	const { mutate: updateTaskDuration } = useUpdateTaskDurationDataMutation()

	const taskDurationsTemp = JSON.parse(JSON.stringify(taskDurations))

	const startDayView = new Date(startMonth)
	const endDayView = new Date(new Date(endMonth.getFullYear(), endMonth.getMonth() + 1, 1) - 1)

	taskDurationsTemp.forEach(task => {
		const startDate = new Date(task.start)
		const endDate = new Date(task.end)

		if (startDayView > startDate)
			task.start = createFormattedDateFromStr(
				startDayView.getFullYear(),
				startDayView.getMonth() + 1,
				startDayView.getDate()
			)
		if (endDayView < endDate)
			task.end = createFormattedDateFromStr(endDayView.getFullYear(), endDayView.getMonth() + 1, endDayView.getDate())
	})

	let monthRows = []
	let dayRows = []
	let dayRow = []
	let weekRows = []
	let weekRow = []
	let taskRows = []
	let taskRow = []
	let incomeRow = []
	let plan_vs_realRow = []
	let realRow = []
	let incomeTotalRow = []

	for (let i = 0; i < weeksTable.length; i++) {
		// create month rows
		monthRows.push(
			<div key={i} style={{ ...ganttTimePeriod, outline: 'none' }}>
				<span style={ganttTimePeriodSpan}>{months[month.getMonth()] + ' ' + month.getFullYear()}</span>
			</div>
		)

		incomeRow.push(
			<div key={i} className={styles.calculation_row}>
				Icome TBD
			</div>
		)
		plan_vs_realRow.push(
			<div key={i} className={styles.calculation_row}>
				Icome Plan vs Real TBD
			</div>
		)
		realRow.push(
			<div key={i} className={styles.calculation_row}>
				Real TBD
			</div>
		)
		incomeTotalRow.push(
			<div key={i} className={styles.calculation_row}>
				Icome total TBD
			</div>
		)

		// create day and week rows
		const numDays = getDaysInMonth(month.getFullYear(), month.getMonth() + 1)
		const currYear = month.getFullYear()
		const currMonth = month.getMonth() + 1

		for (let j = 1; j <= numDays; j++) {
			dayRow.push(
				<div key={j} style={{ ...ganttTimePeriod, outline: 'none' }}>
					<span style={ganttTimePeriodSpan}>{j}</span>
				</div>
			)

			weekRow.push(
				<div key={j} style={{ ...ganttTimePeriod, outline: 'none' }}>
					<span style={{ ...ganttTimePeriodSpan, color: '#3E455B' }}>
						{getDayOfWeek(currYear, currMonth - 1, j - 1)}
					</span>
				</div>
			)
		}

		dayRows.push(
			<div key={i} style={{ ...ganttTimePeriod, outline: 'none' }}>
				{dayRow}
			</div>
		)

		weekRows.push(
			<div key={i} style={{ ...ganttTimePeriod, outline: 'none' }}>
				{weekRow}
			</div>
		)

		dayRow = []
		weekRow = []
		month.setMonth(month.getMonth() + 1)
	}

	const pushRowDuringManipulation = (taskId, j, formattedDate, bkColor) => {
		return (
			<div
				key={`${taskId}-${j}`}
				style={{
					...ganttTimePeriodCell,
					backgroundColor: bkColor,
				}}
				data-task={taskId}
				data-date={formattedDate}
				onMouseEnter={handleDivMouseEnter}
				onMouseUp={e => handleMouseUp(e)}></div>
		)
	}

	// create task rows
	if (tasks && taskDurations) {
		const arrows = []
		tasks.sort((a, b) => a.order - b.order)
		tasks.map(task => {
			let mnth = new Date(startMonth)
			for (let i = 0; i < weeksTable.length; i++) {
				const curYear = mnth.getFullYear()
				const curMonth = mnth.getMonth() + 1
				const numDays = getDaysInMonth(curYear, curMonth)

				for (let j = 1; j <= numDays; j++) {
					// color weekend cells differently
					const dayOfTheWeek = getDayOfWeek(curYear, curMonth - 1, j - 1)
					// add task and date data attributes
					const formattedDate = createFormattedDateFromStr(curYear, curMonth, j)

					if (manipulationModeOn === task?.task) {
						if (taskData[0] <= formattedDate && taskData[1] >= formattedDate) {
							taskRow.push(
								//make cell grey during manipulation
								pushRowDuringManipulation(task.Id, j, formattedDate, 'rgb(200, 200, 200')
							)
						} else {
							taskRow.push(
								//grey cell for 'S' days
								pushRowDuringManipulation(
									task.Id,
									j,
									formattedDate,
									dayOfTheWeek === 'S' ? 'var(--color-tertiary)' : '#fff'
								)
							)
						}
					} else {
						taskRow.push(
							<div
								key={`${task.Id}-${j}`}
								style={{
									...ganttTimePeriodCell,
									backgroundColor: dayOfTheWeek === 'S' ? 'var(--color-tertiary)' : '#fff',
								}}
								data-task={task?.Id}
								data-date={formattedDate}
								onMouseEnter={handleDivMouseEnter}
								onMouseUp={e => handleMouseUp(e)}>
								{taskDurationsTemp.map((el, i) => {
									// console.log(el.start)
									if (el?.task === task?.task && el?.start === formattedDate && el?.task !== manipulationModeOn) {
										if (el?.parent !== null) {
											//fills in arrow data
											arrows.push({
												Id: i,
												start: `${taskDurationsTemp.filter(row => row.task === el?.parent)[0].Id}`,
												end: `${el?.Id}`,
											})
										}
										return (
											<div
												key={`${i}-${el?.Id}`}
												id={`${el?.Id}`}
												tabIndex='0'
												style={{
													...taskDuration,
													width: `calc(${dayDiff(el?.start, el?.end)} * 100% - 1px)`,
												}}
												onKeyDown={e => deleteTaskDuration(e, el?.Id)}
												onMouseEnter={e => {
													setTaskDurationUnderMouseid(el?.task)
												}}
												onMouseLeave={e => {
													setTaskDurationUnderMouseid(null)
												}}>
												{taskDurationUnderMouseid === el?.task && (
													<div
														className={styles.left_box}
														onMouseDown={e => {
															setTaskData([el?.start, el?.end])
															setLeftManipulation(true)
															setManipulationModeOn(task?.task)
														}}></div>
												)}
												{taskDurationUnderMouseid === el?.task && (
													<div
														className={styles.right_box}
														onMouseDown={e => {
															setRightManipulation(true)
															setTaskData([el?.start, el?.end])
															setManipulationModeOn(task?.task)
														}}></div>
												)}
											</div>
										)
									}
									return ''
								})}
								{i === 0 && j === 1 && manipulationModeOn === 0 && <RenderArrows arrows={arrows} />}
							</div>
						)
					}
				}

				taskRows.push(
					<div key={`${i}-${task?.Id}`} style={ganttTimePeriod}>
						{taskRow}
					</div>
				)

				taskRow = []
				mnth.setMonth(mnth.getMonth() + 1)
			}
			return ''
		})
	}

	function deleteTaskDuration(e, Id) {
		if (e.key === 'Delete' || e.key === 'Backspace') {
			// update taskDurations
			// const newTaskDurations = taskDurations.filter(taskDuration => taskDuration.Id !== Id)
			// update state (if data on backend - make API request to update data)
			// setTaskDurations(newTaskDurations)
		}
	}

	function handleMouseUp(e) {
		//manipulationModeOn holds information about task where mouse button was pressed down
		if (manipulationModeOn !== 0) {
			const taskDuration = taskDurations.filter(taskDuration => taskDuration.task === manipulationModeOn)[0]

			const daysDuration = dayDiff(taskData[0], taskData[1])

			// get new task values
			// get start, calc end using daysDuration - make Date objects - change taskDurations

			let newEndDate = new Date(taskData[1])
			newEndDate.setDate(newEndDate.getDate() + daysDuration - 1)

			// update taskDurations
			taskDuration.task = manipulationModeOn
			taskDuration.start = taskData[0]
			taskDuration.end = taskData[1]

			const tableRowId = taskDurations.filter(taskDuration => taskDuration.task === manipulationModeOn)[0].Id
			// update state (if data on backend - make API request to update data)

			updateTaskDuration({
				Id: tableRowId,
				task: manipulationModeOn,
				start: taskDuration.start,
				end: taskDuration.end,
				parent: taskDuration.parent,
				token: token,
			})

			setManipulationModeOn(0)
			setLeftManipulation(false)
			setRightManipulation(false)
		}
	}

	function handleDivMouseEnter(e) {
		const targetCell = e.target
		// prevent adding on another taskDuration
		// find task
		// const taskDuration = taskDurations.filter(taskDuration => taskDuration.id === taskDurationElDraggedid)[0]

		const dataDate = targetCell.getAttribute('data-date')

		if (rightManipulation && dataDate > taskData[0]) {
			setTaskData([taskData[0], dataDate])
		}
		if (leftManipulation && dataDate < taskData[1]) {
			setTaskData([dataDate, taskData[1]])
		}
	}

	return (
		<div
			id='gantt-grid-container__time'
			style={{ gridTemplateColumns: `repeat(${weeksTable.length}, 1fr)` }}
			className={styles.gantt_grid_container__time}>
			{monthRows}
			{dayRows}
			{weekRows}
			{incomeRow}
			{plan_vs_realRow}
			{realRow}
			{incomeTotalRow}

			<div
				id='gantt-time-period-cell-container'
				style={{
					gridColumn: '1/-1',
					display: 'grid',
					gridTemplateColumns: `repeat(${weeksTable.length}, 1fr)`,
					paddingLeft: '0.5px',
				}}>
				{taskRows}
			</div>
		</div>
	)
}
