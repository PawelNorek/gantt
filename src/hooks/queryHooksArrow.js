import { useQuery } from '@tanstack/react-query'
import { getArrowData } from '../api/dataQuery'

//TODO: add select in useQuery to select data and sort before returning it to application
//TODO: possibly add setQueryData in mutating bulk operation to prevent poor user experience

export const useArrowDataQuery = token =>
	useQuery({
		queryKey: ['arrows'],
		queryFn: () => getArrowData(token),
		enabled: token !== '' && token !== undefined,
	})
