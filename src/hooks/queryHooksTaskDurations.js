import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
	addTaskDurationData,
	deleteTaskDurationData,
	getTaskDurationData,
	patchTaskDurationData,
} from '../api/dataQueryTaskDurations'

//TODO: add select in useQuery to select data and sort before returning it to application
//TODO: possibly add setQueryData in mutating bulk operation to prevent poor user experience

export const useTaskDurationDataQuery = token =>
	useQuery({
		queryKey: ['taskDurations'],
		queryFn: () => getTaskDurationData(token),
		enabled: token !== '' && token !== undefined,
	})

//link to guide: https://upmostly.com/tutorials/post-data-with-usemutation-and-react-query-in-your-reactjs-application

export const useAddTaskDurationDataMutation = () => {
	const queryClient = useQueryClient()

	return useMutation(({ task, start, end, parent, token }) => addTaskDurationData(task, start, end, parent, token), {
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['taskDurations'] })
		},
	})
}

export const useUpdateTaskDurationDataMutation = () => {
	const queryClient = useQueryClient()

	return useMutation(
		({ Id, task, start, end, parent, token }) => patchTaskDurationData(Id, task, start, end, parent, token),
		{
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['taskDurations'] })
			},
		}
	)
}

export const useDeleteTaskDurationDataMutation = () => {
	const queryClient = useQueryClient()

	return useMutation(({ Id, token }) => deleteTaskDurationData(Id, token), {
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['taskDurations'] })
		},
	})
}
