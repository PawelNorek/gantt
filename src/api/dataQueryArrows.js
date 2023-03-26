import axios from 'axios'
import settings from '../settings'

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
