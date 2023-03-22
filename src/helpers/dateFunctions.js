export function monthDiff(firstMonth, lastMonth) {
	let months
	months = (lastMonth.getFullYear() - firstMonth.getFullYear()) * 12
	months -= firstMonth.getMonth()
	months += lastMonth.getMonth()
	return months <= 0 ? 0 : months
}

export function dayDiff(startDate, endDate) {
	const difference = new Date(endDate).getTime() - new Date(startDate).getTime()
	const days = Math.ceil(difference / (1000 * 3600 * 24)) + 1
	return days
}
export function weekDiff(startDate, endDate) {
	const difference = new Date(endDate).getTime() - new Date(startDate).getTime()
	const weeks = Math.ceil(difference / (1000 * 3600 * 24 * 7))
	return weeks
}

export function getDaysInMonth(year, month) {
	return new Date(year, month, 0).getDate()
}

export function getDayOfWeek(year, month, day) {
	const daysOfTheWeekArr = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
	const dayOfTheWeekIndex = new Date(year, month, day).getDay()
	return daysOfTheWeekArr[dayOfTheWeekIndex]
}

export function createFormattedDateFromStr(year, month, day) {
	let monthStr = month.toString()
	let dayStr = day.toString()

	if (monthStr.length === 1) {
		monthStr = `0${monthStr}`
	}
	if (dayStr.length === 1) {
		dayStr = `0${dayStr}`
	}
	return `${year}-${monthStr}-${dayStr}`
}

export function createFormattedDateFromDate(date) {
	let monthStr = (date.getMonth() + 1).toString()
	let dayStr = date.getDate().toString()

	if (monthStr.length === 1) {
		monthStr = `0${monthStr}`
	}
	if (dayStr.length === 1) {
		dayStr = `0${dayStr}`
	}
	return `${date.getFullYear()}-${monthStr}-${dayStr}`
}

export function getISOWeekStartDate(weekNumber, year) {
	// const simple = new Date(year, 0, 1 + (weekNumber - 1) * 7)
	// const dayOfWeek = simple.getDay()
	// const isoWeekStart =
	// 	dayOfWeek === 0 ? simple.setDate(simple.getDate() - 6) : simple.setDate(simple.getDate() + 1 - dayOfWeek)

	let simple = new Date(year, 0, 1 + (weekNumber - 1) * 7)
	let dayOfWeek = simple.getDay()
	let ISOweekStart = simple
	if (dayOfWeek <= 4) ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1)
	else ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay())
	return ISOweekStart

	// return new Date(isoWeekStart)
}

export function getWeekDatesString(weekNumber, year, days) {
	const start = getISOWeekStartDate(weekNumber, year)
	const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + days - 1)

	const startStr = `${start.getDate().toString().padStart(2, '0')}${(start.getMonth() + 1)
		.toString()
		.padStart(2, '0')}${start.getFullYear()}`
	const endStr = `${end.getDate().toString().padStart(2, '0')}${(end.getMonth() + 1)
		.toString()
		.padStart(2, '0')}${end.getFullYear()}`

	return `${startStr}-${endStr}`
}

// Returns the ISO week of the date.
export function getISOWeek(year, month, day) {
	let date = new Date(year, month - 1, day)
	date.setHours(0, 0, 0, 0)
	// Thursday in current week decides the year.
	date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7))
	// January 4 is always in week 1.
	let week1 = new Date(date.getFullYear(), 0, 4)
	// Adjust to Thursday in week 1 and count number of weeks from date to week1.
	return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7)
}
