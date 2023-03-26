import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { addTasksData, deleteTasksData, getTasksData, patchTasksData, patchTasksDataBulk } from '../api/dataQueryTasks'

//TODO: add select in useQuery to select data and sort before returning it to application
//TODO: possibly add setQueryData in mutating bulk operation to prevent poor user experience

export const useTasksDataQuery = token =>
	useQuery({
		queryKey: ['tasks'],
		queryFn: () => getTasksData(token),
		enabled: token !== '' && token !== undefined,
	})

//link to guide: https://upmostly.com/tutorials/post-data-with-usemutation-and-react-query-in-your-reactjs-application

export const useAddTasksDataMutation = () => {
	const queryClient = useQueryClient()

	return useMutation(({ name, value, order, token }) => addTasksData(name, value, order, token), {
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['tasks'] })
		},
	})
}

export const useUpdateTasksDataMutation = () => {
	const queryClient = useQueryClient()

	return useMutation(({ Id, name, value, order, token }) => patchTasksData(Id, name, value, order, token), {
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['tasks'] })
		},
	})
}

export const useUpdateTasksDataMutationBulk = () => {
	const queryClient = useQueryClient()

	return useMutation(({ data, token }) => patchTasksDataBulk(data, token), {
		onSuccess: data => {
			queryClient.invalidateQueries({ queryKey: ['tasks'] })
		},
	})
}

export const useDeleteTasksDataMutation = () => {
	const queryClient = useQueryClient()

	return useMutation(({ Id, token }) => deleteTasksData(Id, token), {
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['tasks'] })
		},
	})
}
