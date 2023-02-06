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
import { patchTaskDurationData } from '../../api/dataQuery'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { RenderArrows } from './RenderArrows'

export default function TimeTable({ timeRange, tasks, taskDurations, setTaskDurations, arrows, token }) {
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

	const queryClient = useQueryClient()

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

	for (let i = 0; i < numMonths; i++) {
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

	// create task rows
	if (tasks && taskDurations && arrows) {
		const test_arrow = []
		tasks.forEach(task => {
			let mnth = new Date(startMonth)
			for (let i = 0; i < numMonths; i++) {
				const curYear = mnth.getFullYear()
				const curMonth = mnth.getMonth() + 1

				const numDays = getDaysInMonth(curYear, curMonth)

				for (let j = 1; j <= numDays; j++) {
					// color weekend cells differently
					const dayOfTheWeek = getDayOfWeek(curYear, curMonth - 1, j - 1)
					// add task and date data attributes
					const formattedDate = createFormattedDateFromStr(curYear, curMonth, j)

					if (manipulationModeOn === task?.Id) {
						if (taskData[0] <= formattedDate && taskData[1] >= formattedDate) {
							taskRow.push(
								<div
									key={`${task.Id}-${j}`}
									style={{
										...ganttTimePeriodCell,
										backgroundColor: 'rgb(200, 200, 200)',
									}}
									data-task={task?.Id}
									data-date={formattedDate}
									onMouseEnter={handleDivMouseEnter}
									onMouseUp={e => handleMouseUp(e)}></div>
							)
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
									onMouseUp={e => handleMouseUp(e)}></div>
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
								{taskDurations.map((el, i) => {
									if (el?.task === task?.Id && el?.start === formattedDate && el?.task !== manipulationModeOn) {
										// console.log(el, i)
										if (el?.parent !== null) {
											test_arrow.push({
												Id: i,
												start: `${el?.parent}`,
												end: `${el?.task}`,
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
													setTaskDurationUnderMouseid(el?.Id)
												}}
												onMouseLeave={e => {
													setTaskDurationUnderMouseid(null)
												}}>
												{taskDurationUnderMouseid === el?.Id && (
													<div
														className={styles.left_box}
														onMouseDown={e => {
															setTaskData([el?.start, el?.end])
															setLeftManipulation(true)
															setManipulationModeOn(task?.Id)
														}}></div>
												)}
												{taskDurationUnderMouseid === el?.Id && (
													<div
														className={styles.right_box}
														onMouseDown={e => {
															setRightManipulation(true)
															setTaskData([el?.start, el?.end])
															setManipulationModeOn(task?.Id)
														}}></div>
												)}
											</div>
										)
									}
									return ''
								})}
								{/* {i === 0 && j === 1 && manipulationModeOn === 0 && <RenderArrows arrows={arrows} />} */}
								{i === 0 && j === 1 && manipulationModeOn === 0 && <RenderArrows arrows={test_arrow} />}
							</div>
						)
					}
				}

				// console.log(taskRow)

				taskRows.push(
					<div key={`${i}-${task?.Id}`} style={ganttTimePeriod}>
						{taskRow}
					</div>
				)

				taskRow = []
				mnth.setMonth(mnth.getMonth() + 1)
			}
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

	const usePatchTaskDurationDataMutation = useMutation({
		mutationFn: ({ Id, task, start, end, parent, token }) => patchTaskDurationData(Id, task, start, end, parent, token),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['taskDurations'] })
		},
	})

	function handleMouseUp(e) {
		//manipulationModeOn holds information about task where mouse button was pressed down
		if (manipulationModeOn !== 0) {
			const taskDuration = taskDurations.filter(taskDuration => taskDuration.task === manipulationModeOn)[0]

			const daysDuration = dayDiff(taskData[0], taskData[1])

			// get new task values
			// get start, calc end using daysDuration - make Date objects - change taskDurations

			// const newTask = parseInt(task)
			// const newStartDate = new Date(taskData[0])
			let newEndDate = new Date(taskData[1])
			newEndDate.setDate(newEndDate.getDate() + daysDuration - 1)

			// update taskDurations
			taskDuration.task = manipulationModeOn
			taskDuration.start = taskData[0]
			taskDuration.end = taskData[1]

			// const newTaskDurations = taskDurations.filter(taskDuration => taskDuration.task !== manipulationModeOn)
			// newTaskDurations.push(taskDuration)
			const tableRowId = taskDurations.filter(taskDuration => taskDuration.task === manipulationModeOn)[0].Id
			// update state (if data on backend - make API request to update data)
			// setTaskDurations(newTaskDurations)

			usePatchTaskDurationDataMutation.mutate({
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
		// console.log(targetCell)
		// prevent adding on another taskDuration
		// find task
		// const taskDuration = taskDurations.filter(taskDuration => taskDuration.id === taskDurationElDraggedid)[0]

		// const dataTask = targetCell.getAttribute('data-task')
		const dataDate = targetCell.getAttribute('data-date')

		// const daysDuration = dayDiff(taskDuration.start, taskDuration.end)
		// console.log(dataTask, dataDate)
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
			style={{ gridTemplateColumns: `repeat(${numMonths}, 1fr)` }}
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
					gridTemplateColumns: `repeat(${numMonths}, 1fr)`,
					paddingLeft: '0.5px',
				}}>
				{taskRows}
			</div>
		</div>
	)
}
