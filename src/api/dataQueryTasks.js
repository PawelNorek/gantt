import axios from 'axios'
import settings from '../settings'

export const getTasksData = async token => {
	const config = {
		method: 'GET',
		url: `https://${settings.host}/api/v1/db/data/noco/p_ms46kiyconfhxk/tasks/views/tasks?offset=0&limit=25&where=`,
		headers: {
			'Content-Type': 'application/json',
			'xc-auth': token,
		},
	}

	const response = await axios(config)
	return response.data
}

export const patchTasksData = async (id, task, name, value, order, token) => {
	const config = {
		method: 'PATCH',
		url: `https://${settings.host}/api/v1/db/data/noco/p_ms46kiyconfhxk/tasks/${id}`,
		headers: {
			'Content-Type': 'application/json',
			'xc-auth': token,
		},
		data: JSON.stringify({
			task: task,
			name: name,
			value: value,
			order: order,
		}),
	}

	return await axios(config)
}

export const addTasksData = async (task, name, value, order, token) => {
	const config = {
		method: 'POST',
		url: `https://${settings.host}/api/v1/db/data/noco/p_ms46kiyconfhxk/tasks/`,
		headers: {
			'Content-Type': 'application/json',
			'xc-auth': token,
		},
		data: JSON.stringify({
			task: task,
			name: name,
			value: value,
			order: order,
		}),
	}

	return await axios(config)
}

export const deleteTasksData = async (id, token) => {
	const config = {
		method: 'DELETE',
		url: `https://${settings.host}/api/v1/db/data/noco/p_ms46kiyconfhxk/tasks/${id}`,
		headers: {
			'Content-Type': 'application/json',
			'xc-auth': token,
		},
	}

	return await axios(config)
}

export const patchTasksDataBulk = async (data, token) => {
	const config = {
		method: 'PATCH',
		url: `https://${settings.host}/api/v1/db/data/bulk/noco/p_ms46kiyconfhxk/tasks`,
		headers: {
			'Content-Type': 'application/json',
			'xc-auth': token,
		},
		data: JSON.stringify(data),
	}

	return await axios(config)
}
