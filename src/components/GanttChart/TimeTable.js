import { useState } from 'react'
import styles from './TimeTable.module.css'
import {
	monthDiff,
	getDaysInMonth,
	getDayOfWeek,
	createFormattedDateFromStr,
	createFormattedDateFromDate,
	dayDiff,
} from '../../helpers/dateFunctions'
import { months } from '../../constants'
import Xarrow, { Xwrapper } from 'react-xarrows'

export default function TimeTable({ timeRange, tasks, taskDurations, setTaskDurations, arrows }) {
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
		position: 'absolute',
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

	const [taskDurationElDraggedId, setTaskDurationElDraggedId] = useState(null)

	// const updateXarrow = useXarrow()

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

	function RenderArrows({ arrows }) {
		// const updateXarrow = useXarrow()
		return arrows.map(arrow => {
			// console.log('test', arrow.start, arrow.end)
			return (
				<Xarrow key={arrow.id} start={arrow.start} end={arrow.end} startAnchor='bottom' endAnchor='left' path='grid' />
			)
			// return <div>test</div>
		})
	}

	// RenderArrows(arrows)

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

	// const DraggableBox = ({ box }) => {
	// 	const updateXarrow = useXarrow()
	// 	return (
	// 		<Draggable onDrag={updateXarrow} onStop={updateXarrow}>
	// 			<div id={box.id} style={{ ...boxStyle, position: 'absolute', left: box.x, top: box.y }}>
	// 				{box.id}
	// 			</div>
	// 		</Draggable>
	// 	)
	// }

	// create task rows
	if (tasks) {
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

					taskRow.push(
						<div
							key={`${task.id}-${j}`}
							style={{
								...ganttTimePeriodCell,
								backgroundColor: dayOfTheWeek === 'S' ? 'var(--color-tertiary)' : '#fff',
							}}
							data-task={task?.id}
							data-date={formattedDate}
							onDrop={onTaskDurationDrop}>
							{taskDurations.map((el, i) => {
								if (el?.task === task?.id && el?.start === formattedDate) {
									return (
										<div
											key={`${i}-${el?.id}`}
											id={`${el?.id}`}
											draggable='true'
											tabIndex='0'
											onDragStart={() => handleDragStart(el?.id)}
											style={{
												...taskDuration,
												width: `calc(${dayDiff(el?.start, el?.end)} * 100% - 1px)`,
												opacity: taskDurationElDraggedId === el?.id ? '0.5' : '1',
											}}
											onKeyDown={e => deleteTaskDuration(e, el?.id)}>
											<RenderArrows arrows={arrows} />
										</div>
									)
								}
								return ''
							})}
						</div>
					)
				}

				taskRows.push(
					<div key={`${i}-${task?.id}`} style={ganttTimePeriod}>
						{taskRow}
					</div>
				)

				taskRow = []
				mnth.setMonth(mnth.getMonth() + 1)
			}
		})
	}

	function deleteTaskDuration(e, id) {
		if (e.key === 'Delete' || e.key === 'Backspace') {
			// update taskDurations
			const newTaskDurations = taskDurations.filter(taskDuration => taskDuration.id !== id)
			// update state (if data on backend - make API request to update data)
			setTaskDurations(newTaskDurations)
		}
	}

	function handleDragStart(taskDurationId) {
		console.log(taskDurationId)
		setTaskDurationElDraggedId(taskDurationId)
	}

	function onTaskDurationDrop(e) {
		const targetCell = e.target
		// prevent adding on another taskDuration
		if (!targetCell.hasAttribute('draggable')) {
			// find task
			const taskDuration = taskDurations.filter(taskDuration => taskDuration.id === taskDurationElDraggedId)[0]

			const dataTask = targetCell.getAttribute('data-task')
			const dataDate = targetCell.getAttribute('data-date')

			const daysDuration = dayDiff(taskDuration.start, taskDuration.end)

			// get new task values
			// get start, calc end using daysDuration - make Date objects - change taskDurations
			const newTask = parseInt(dataTask)
			const newStartDate = new Date(dataDate)
			let newEndDate = new Date(dataDate)
			newEndDate.setDate(newEndDate.getDate() + daysDuration - 1)

			// update taskDurations
			taskDuration.task = newTask
			taskDuration.start = createFormattedDateFromDate(newStartDate)
			taskDuration.end = createFormattedDateFromDate(newEndDate)

			const newTaskDurations = taskDurations.filter(taskDuration => taskDuration.id !== taskDurationElDraggedId)
			newTaskDurations.push(taskDuration)

			// update state (if data on backend - make API request to update data)
			setTaskDurations(newTaskDurations)
		}
		setTaskDurationElDraggedId(null)
		// console.log('dropped')
		// window.location.reload();
	}

	// renderArrows(arrows)

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

			<Xwrapper>
				<div
					id='gantt-time-period-cell-container'
					onDragOver={e => e.preventDefault()}
					style={{
						gridColumn: '1/-1',
						display: 'grid',
						gridTemplateColumns: `repeat(${numMonths}, 1fr)`,
						paddingLeft: '0.5px',
					}}>
					{taskRows}
				</div>
			</Xwrapper>
		</div>
	)
}
