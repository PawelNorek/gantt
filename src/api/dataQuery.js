import axios from 'axios'
import settings from '../settings'

export const getTaskData = async token => {
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

export const getArrowData = async token => {
	const config = {
		method: 'GET',
		url: `https://${settings.host}/api/v1/db/data/noco/p_ms46kiyconfhxk/arrows/views/arrows?offset=0&limit=25&where=`,
		headers: {
			'Content-Type': 'application/json',
			'xc-auth': token,
		},
	}

	const response = await axios(config)
	return response.data
}

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

export const patchTasksData = async (id, task, name, value, token) => {
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

export const getToken = async (email, password) => {
	let data = JSON.stringify({
		email,
		password,
	})

	let config = {
		method: 'post',
		url: `https://${settings.host}/api/v1/auth/user/signin`,
		headers: {
			'Content-Type': 'application/json',
		},
		data: data,
	}

	const response = await axios(config)

	return response.data
}
