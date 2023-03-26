import { useState } from 'react'
import styles from './TimeTable.module.css'
import {
	// monthDiff,
	// getDaysInMonth,
	// getDayOfWeek,
	createFormattedDateFromStr,
	createFormattedDateFromWeek_Friday,
	createFormattedDateFromWeek_Monday,
	dayDiff,
	getFriday,
	getISOWeek,
	getISOWeekFromDate,
	getISOWeekStartDate,
	getMonday,
	weekDiff,
} from '../../helpers/dateFunctions'
import { useUpdateTaskDurationDataMutation } from '../../hooks/queryHooks'
import { RenderArrows } from './RenderArrows'
// import { element } from 'prop-types'

// export default function TimeTable({ timeRange, tasks, taskDurations, setTaskDurations, arrows, token }) {
export default function TimeTable({ weeksTable, tasks, taskDurations, token }) {
	// for dynamic css styling
	const ganttTimePeriod = {
		display: 'grid',
		gridAutoFlow: 'column',
		gridAutoColumns: 'minmax(70px, 1fr)',
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

	const [taskDurationUnderMouseid, setTaskDurationUnderMouseid] = useState(null)
	const [manipulationModeOn, setManipulationModeOn] = useState(0)
	const [taskData, setTaskData] = useState([])
	const [leftManipulation, setLeftManipulation] = useState(false)
	const [rightManipulation, setRightManipulation] = useState(false)

	const { mutate: updateTaskDuration } = useUpdateTaskDurationDataMutation()

	const taskDurationsTemp = JSON.parse(JSON.stringify(taskDurations))

	// const startDayView = new Date(startMonth)
	// const endDayView = new Date(new Date(endMonth.getFullYear(), endMonth.getMonth() + 1, 1) - 1)

	// taskDurationsTemp.forEach(task => {
	// 	const startDate = new Date(task.start)
	// 	const endDate = new Date(task.end)

	// 	if (startDayView > startDate)
	// 		task.start = createFormattedDateFromStr(
	// 			startDayView.getFullYear(),
	// 			startDayView.getMonth() + 1,
	// 			startDayView.getDate()
	// 		)
	// 	if (endDayView < endDate)
	// 		task.end = createFormattedDateFromStr(endDayView.getFullYear(), endDayView.getMonth() + 1, endDayView.getDate())
	// })

	let taskRows = []
	let taskRow = []
	let incomeRow = []
	let plan_vs_realRow = []
	let realRow = []
	let incomeTotalRow = []

	let weeks = []
	let months = []
	let dates = []

	weeksTable.forEach(element => {
		weeks.push(
			<div key={element.week} style={{ ...ganttTimePeriod }}>
				<span style={ganttTimePeriodSpan}>{element.week}</span>
			</div>
		)
		months.push(
			<div key={element.week} style={{ ...ganttTimePeriod, outline: 'none' }}>
				<span style={ganttTimePeriodSpan}>{element.month}</span>
			</div>
		)
		dates.push(
			<div key={element.week} style={{ ...ganttTimePeriod }}>
				<span style={{ ...ganttTimePeriodSpan, fontSize: '0.8em' }}>{element.weekString}</span>
			</div>
		)
		incomeRow.push(
			<div key={element.week} className={styles.calculation_row}>
				Icome TBD
			</div>
		)
		plan_vs_realRow.push(
			<div key={element.week} className={styles.calculation_row}>
				Icome Plan vs Real TBD
			</div>
		)
		realRow.push(
			<div key={element.week} className={styles.calculation_row}>
				Real TBD
			</div>
		)
		incomeTotalRow.push(
			<div key={element.week} className={styles.calculation_row}>
				Icome total TBD
			</div>
		)
	})

	const pushRowDuringManipulation = (taskId, formattedDate, bkColor) => {
		return (
			<div
				key={`${taskId}`}
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
			for (let i = 0; i < weeksTable.length; i++) {
				if (manipulationModeOn === task?.task) {
					if (
						getISOWeekFromDate(taskData[0]) <= weeksTable[i].week &&
						getISOWeekFromDate(taskData[1]) >= weeksTable[i].week
					) {
						taskRow.push(
							//make cell grey during manipulation
							pushRowDuringManipulation(task?.Id, weeksTable[i].week, 'rgb(200, 200, 200')
						)
					} else {
						taskRow.push(
							//make cell grey during manipulation
							pushRowDuringManipulation(task?.Id, weeksTable[i].week, '#fff')
						)
					}
				} else {
					taskRow.push(
						<div
							// key={`${task.Id}-${j}`}
							key={`${task.Id}`}
							style={{
								...ganttTimePeriodCell,
								// backgroundColor: dayOfTheWeek === 'S' ? 'var(--color-tertiary)' : '#fff',
							}}
							data-task={task?.Id}
							data-date={weeksTable[i].week}
							onMouseEnter={handleDivMouseEnter}
							onMouseUp={e => handleMouseUp(e)}>
							{taskDurationsTemp.map((el, index) => {
								let elStartWeek = getISOWeekFromDate(el.start)
								let elEndWeek = getISOWeekFromDate(el.end)
								// console.log(elStartWeek, weeksTable[i].week)
								if (el?.task === task?.task && elStartWeek === weeksTable[i].week && el?.task !== manipulationModeOn) {
									if (el?.parent !== null) {
										//fills in arrow data
										arrows.push({
											Id: index,
											start: `${taskDurationsTemp.filter(row => row.task === el?.parent)[0].Id}`,
											end: `${el?.Id}`,
										})
									}

									return (
										<div
											key={`${index}-${el?.Id}`}
											id={`${el?.Id}`}
											tabIndex='0'
											style={{
												...taskDuration,
												// width: `calc(${dayDiff(el?.start, el?.end)} * 100% - 1px)`,
												width: `calc(${weekDiff(getMonday(el?.start), getFriday(el?.end))} * 100% - 1px)`,
												// width: `calc(${elEndWeek - elStartWeek} * 100% - 1px)`,
											}}
											onKeyDown={e => deleteTaskDuration(e, el?.Id)}
											onMouseEnter={e => {
												setTaskDurationUnderMouseid(el?.task)
											}}
											onMouseLeave={e => {
												setTaskDurationUnderMouseid(null)
											}}>
											{taskDurationUnderMouseid === el?.task && (
												<>
													<div
														className={styles.left_box}
														onMouseDown={e => {
															setTaskData([el?.start, el?.end])
															setLeftManipulation(true)
															setManipulationModeOn(task?.task)
														}}></div>
													<div
														className={styles.right_box}
														onMouseDown={e => {
															setRightManipulation(true)
															setTaskData([el?.start, el?.end])
															setManipulationModeOn(task?.task)
														}}></div>
												</>
											)}
										</div>
									)
								}
								return ''
							})}
							{i === 0 && manipulationModeOn === 0 && <RenderArrows arrows={arrows} />}
						</div>
					)
				}
				// }

				taskRows.push(
					<div key={`${i}-${task?.Id}`} style={ganttTimePeriod}>
						{/* <div key={`${task?.Id}`} style={ganttTimePeriod}> */}
						{taskRow}
					</div>
				)

				taskRow = []
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

		// console.log('handleDivMouseEnter: ', dataDate, getISOWeekFromDate(taskData[0]), getISOWeekFromDate(taskData[1]))

		if (rightManipulation && dataDate > getISOWeekFromDate(taskData[0])) {
			// console.log('right manipulation: ', createFormattedDateFromWeek_Friday(dataDate, 2023))
			setTaskData([taskData[0], createFormattedDateFromWeek_Friday(dataDate, 2023)])
		}
		if (leftManipulation && dataDate < getISOWeekFromDate(taskData[1])) {
			// console.log('left manipulation: ', createFormattedDateFromWeek_Monday(dataDate, 2023))
			setTaskData([createFormattedDateFromWeek_Monday(dataDate, 2023), taskData[1]])
		}
	}

	return (
		<div
			id='gantt-grid-container__time'
			style={{ gridTemplateColumns: `repeat(${weeksTable.length}, 1fr)` }}
			className={styles.gantt_grid_container__time}>
			{weeks}
			{months}
			{dates}
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
