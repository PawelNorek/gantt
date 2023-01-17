import { months } from '../../constants'
import styles from './TimeRange.module.css'

export default function TimeRange({ timeRange, setTimeRange }) {
	// add date selector values
	let monthsOptions = []
	for (let i = 0; i < months.length; i++) {
		monthsOptions.push(
			<option key={i} value={i}>
				{months[i]}
			</option>
		)
	}

	const yearsOptions = []
	for (let i = 2022; i <= 2050; i++) {
		yearsOptions.push(
			<option key={i} value={i}>
				{i}
			</option>
		)
	}

	function onChange(e) {
		const { value, id } = e.target
		if (id === 'from-select-month') {
			setTimeRange(prevState => {
				return { ...prevState, fromSelectMonth: value }
			})
		}
		if (id === 'from-select-year') {
			setTimeRange(prevState => {
				return { ...prevState, fromSelectYear: value }
			})
		}
		if (id === 'to-select-month') {
			setTimeRange(prevState => {
				return { ...prevState, toSelectMonth: value }
			})
		}
		if (id === 'to-select-year') {
			setTimeRange(prevState => {
				return { ...prevState, toSelectYear: value }
			})
		}
	}

	return (
		<div id='time-range__container' className={styles.time_range__container}>
			<h2>Tracker Period</h2>
			<div id='time-range' className={styles.time_range}>
				<fieldset id='select-from' style={{ paddingLeft: '0px' }} className={styles.fieldset}>
					<legend>From</legend>
					<select
						id='from-select-month'
						name='from-select-month'
						value={timeRange.fromSelectMonth}
						onChange={onChange}
						className={styles.select}>
						{monthsOptions}
					</select>
					<select
						id='from-select-year'
						name='from-select-year'
						value={timeRange.fromSelectYear}
						onChange={onChange}
						style={{ marginLeft: '5px' }}
						className={styles.select}>
						{yearsOptions}
					</select>
				</fieldset>

				<fieldset id='select-to' className={styles.fieldset}>
					<legend>To</legend>
					<select
						id='to-select-month'
						name='to-select-month'
						value={timeRange.toSelectMonth}
						onChange={onChange}
						className={styles.select}>
						{monthsOptions}
					</select>
					<select
						id='to-select-year'
						name='to-select-year'
						value={timeRange.toSelectYear}
						onChange={onChange}
						style={{ marginLeft: '5px' }}
						className={styles.select}>
						{yearsOptions}
					</select>
				</fieldset>
			</div>
		</div>
	)
}
