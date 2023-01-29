import axios from 'axios'
import settings from '../settings'

// export const getTaskData = token => {
// 	const config = {
// 		method: 'GET',
// 		url: `https://${settings.host}/api/v1/db/data/noco/p_ms46kiyconfhxk/tasks/views/tasks?offset=0&limit=25&where=`,
// 		headers: {
// 			'xc-auth': { token },
// 		},
// 	}

// 	return axios(config)
// 		.then(function (response) {
// 			return JSON.stringify(response.data)
// 		})
// 		.catch(function (error) {
// 			return error
// 		})
// }

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
