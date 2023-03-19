import { getWeekDatesString } from '../dateFunctions'

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
