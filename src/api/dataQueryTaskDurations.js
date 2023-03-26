import axios from 'axios'
import settings from '../settings'

export const getTaskDurationData = async token => {
	const config = {
		method: 'GET',
		url: `https://${settings.host}/api/v1/db/data/noco/p_ms46kiyconfhxk/task_durations/views/task_durations?offset=0&limit=25&where=`,
		headers: {
			'Content-Type': 'application/json',
			'xc-auth': token,
		},
	}

	const response = await axios(config)
	return response.data
}

export const addTaskDurationData = async (task, start, end, parent, token) => {
	const config = {
		method: 'POST',
		url: `https://${settings.host}/api/v1/db/data/noco/p_ms46kiyconfhxk/task_durations/`,
		headers: {
			'Content-Type': 'application/json',
			'xc-auth': token,
		},
		data: JSON.stringify({
			task: task,
			start: start,
			end: end,
			parent: parent,
		}),
	}

	return await axios(config)
}

export const patchTaskDurationData = async (id, task, start, end, parent, token) => {
	const config = {
		method: 'PATCH',
		url: `https://${settings.host}/api/v1/db/data/noco/p_ms46kiyconfhxk/task_durations/${id}`,
		headers: {
			'Content-Type': 'application/json',
			'xc-auth': token,
		},
		data: JSON.stringify({
			task: task,
			start: start,
			end: end,
			parent: parent,
		}),
	}

	return await axios(config)
}

export const deleteTaskDurationData = async (id, token) => {
	const config = {
		method: 'DELETE',
		url: `https://${settings.host}/api/v1/db/data/noco/p_ms46kiyconfhxk/task_durations/${id}`,
		headers: {
			'Content-Type': 'application/json',
			'xc-auth': token,
		},
	}

	return await axios(config)
}
