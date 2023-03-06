import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
	addTaskDurationData,
	addTasksData,
	deleteTaskDurationData,
	deleteTasksData,
	getArrowData,
	getTaskData,
	getTaskDurationData,
	patchTaskDurationData,
	patchTasksData,
	patchTasksDataBulk,
} from '../api/dataQuery'

//TODO: add select in useQuery to select data and sort before returning it to application

export const useTasksDataQuery = token =>
	useQuery({
		queryKey: ['tasks'],
		queryFn: () => getTaskData(token),
		enabled: token !== '' && token !== undefined,
	})

export const useArrowDataQuery = token =>
	useQuery({
		queryKey: ['arrows'],
		queryFn: () => getArrowData(token),
		enabled: token !== '' && token !== undefined,
	})

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

export const useAddTasksDataMutation = () => {
	const queryClient = useQueryClient()

	return useMutation(({ task, name, value, order, token }) => addTasksData(task, name, value, order, token), {
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['tasks'] })
		},
	})
}

export const useUpdateTasksDataMutation = () => {
	const queryClient = useQueryClient()

	return useMutation(({ Id, task, name, value, order, token }) => patchTasksData(Id, task, name, value, order, token), {
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['tasks'] })
		},
	})
}

export const useUpdateTasksDataMutationBulk = () => {
	const queryClient = useQueryClient()

	return useMutation(({ data, token }) => patchTasksDataBulk(data, token), {
		onSuccess: data => {
			// const queryData = data.config.data
			// queryClient.setQueryData({ queryKey: ['tasks'], queryData })
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
