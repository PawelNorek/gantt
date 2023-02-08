import { useMutation, useQuery } from '@tanstack/react-query'
import { getArrowData, getTaskData, getTaskDurationData, patchTasksData } from '../api/dataQuery'

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

export const usePatchTasksDataMutation = (queryClient, Id, task, name, value, token) =>
	useMutation({
		mutationFn: () => patchTasksData(Id, task, name, value, token),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['tasks'] })
		},
	})
