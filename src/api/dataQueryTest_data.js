import axios from 'axios'
import settings from '../settings'

export const addTest_data = async (task, name, value, order, token) => {
	const config = {
		method: 'POST',
		url: `https://${settings.host}/api/v1/db/data/noco/p_ms46kiyconfhxk/test_data/`,
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
