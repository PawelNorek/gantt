import axios from 'axios'
import settings from '../settings'

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
