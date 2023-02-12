import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
	deleteTaskDurationData,
	deleteTasksData,
	getArrowData,
	getTaskData,
	getTaskDurationData,
	patchTaskDurationData,
	patchTasksData,
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

export const useUpdateTaskDurationDataMutation = () => {
	const queryClient = useQueryClient()
	queryClient.setMutationDefaults(['taskDurations'], {
		mutationFn: ({ Id, task, start, end, parent, token }) => patchTaskDurationData(Id, task, start, end, parent, token),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['taskDurations'] })
		},
	})
	return useMutation(['taskDurations'])
}

export const useDeleteTaskDurationDataMutation = () => {
	const queryClient = useQueryClient()
	queryClient.setMutationDefaults(['taskDurations'], {
		mutationFn: ({ Id, token }) => deleteTaskDurationData(Id, token),
		onSuccess: () => {queryClient.invalidateQueries({ queryKey: ['taskDurations'] })},
	})
	return useMutation(['taskDurations'])
}

export const useUpdateTasksDataMutation = () => {
	const queryClient = useQueryClient()
	queryClient.setMutationDefaults(['tasks'], {
		mutationFn: ({ Id, task, name, value, token }) => patchTasksData(Id, task, name, value, token),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['tasks'] })
		},
	})
	return useMutation(['tasks'])
}

export const useDeleteTasksDataMutation = () => {
	const queryClient = useQueryClient()
	queryClient.setMutationDefaults(['tasks'], {
		mutationFn: ({ Id, token }) => deleteTasksData(Id, token),
		onSuccess: () => {queryClient.invalidateQueries({ queryKey: ['tasks'] })},
	})
	return useMutation(['tasks'])
}

