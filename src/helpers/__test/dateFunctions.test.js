import { getISOWeek, getWeekDatesString } from '../dateFunctions'

describe('getWeekDatesString function', () => {
	it('returns correct range of week dates as string', () => {
		const weekNumber = 10
		const year = 2022
		const days = 7
		const result = getWeekDatesString(weekNumber, year, days)
		expect(result).toEqual('07032022-13032022')
	})

	it('handles leap year correctly', () => {
		const weekNumber = 9
		const year = 2024
		const days = 7
		const result = getWeekDatesString(weekNumber, year, days)
		expect(result).toEqual('26022024-03032024')
	})

	it('handles shorter date range correctly', () => {
		const weekNumber = 5
		const year = 2023
		const days = 3
		const result = getWeekDatesString(weekNumber, year, days)
		expect(result).toEqual('30012023-01022023')
	})
})

describe('getISOWeek', () => {
	it('should return the correct ISO week number for a valid date', () => {
		expect(getISOWeek(2022, 10, 27)).toEqual(43)
	})

	it('should return 52 for a date in the first week of the year', () => {
		expect(getISOWeek(2022, 1, 1)).toEqual(52)
	})

	it('should return 52 for a date in the last week of the year', () => {
		expect(getISOWeek(2021, 12, 31)).toEqual(52)
	})

	it('should return 52 for a date in the last week of a leap year', () => {
		expect(getISOWeek(2024, 12, 29)).toEqual(52)
	})

	// it('should throw an error for an invalid date', () => {
	// 	expect(() => getISOWeek(2022, 2, 29)).toThrow('Invalid Date')
	// })
})
