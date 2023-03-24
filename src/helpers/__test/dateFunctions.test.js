import { getFriday, getISOWeek, getMonday, getWeekDatesString, weekDiff } from '../dateFunctions'

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

describe('weekDiff', () => {
	it('should return 1 for dates 2023-03-01 and 2023-03-02', () => {
		expect(weekDiff('2023-03-01', '2023-03-02')).toEqual(1)
	})
	it('should return 2 for dates 2023-03-01 and 2023-03-09', () => {
		expect(weekDiff('2023-03-01', '2023-03-09')).toEqual(2)
	})
	it('should return 4 for dates getMonday(2023-03-14) and getFriday(2023-04-03)', () => {
		expect(weekDiff(getMonday('2023-03-14'), getFriday('2023-04-03'))).toEqual(4)
	})
	it('should return 5 for dates getMonday(2023-02-17) and getFriday(2023-03-15)', () => {
		expect(weekDiff(getMonday('2023-02-17'), getFriday('2023-03-15'))).toEqual(5)
	})
})

describe('getMonday for given date', () => {
	it('should return 2023-03-13', () => {
		expect(getMonday('2023-03-14')).toEqual(new Date('2023-03-13'))
	})
	it('should return 2023-03-01', () => {
		expect(getMonday('2023-03-01')).toEqual(new Date('2023-02-27'))
	})
})

describe('getFriday for given date', () => {
	it('should return 2023-03-17', () => {
		expect(getFriday('2023-03-14')).toEqual(new Date('2023-03-17'))
	})
	it('should return 2023-03-01', () => {
		expect(getFriday('2023-03-01')).toEqual(new Date('2023-03-03'))
	})
})
