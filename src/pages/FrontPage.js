import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useState } from 'react'
import { getArrowData, getTaskData, getTaskDurationData, getToken } from '../api/dataQuery'

export default function FrontPage({ token, setToken }) {
	const [emailValue, setEmailValue] = useState('')
	const [passwordValue, setPasswordValue] = useState('')

	function handleEmailChange(e) {
		setEmailValue(e.target.value)
	}

	function handlePasswordChange(e) {
		setPasswordValue(e.target.value)
	}

	function handleLoginButton() {
		getToken(emailValue, passwordValue)
			.then(data => setToken(data.token))
			.catch(data => console.log('error:', data))
	}

	const {
		data: tasksData,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['tasksData'],
		queryFn: () => getTaskData(token),
		enabled: token !== '' && token !== undefined,
	})

	const {
		data: arrowData,
		isLoading: isPendingArrowData,
		error: errorArrowData,
	} = useQuery({
		queryKey: ['arrowData'],
		queryFn: () => getArrowData(token),
		enabled: token !== '' && token !== undefined,
	})

	const {
		data: taskDurationsData,
		isLoading: isPendingTaskDuration,
		error: errorTaskDuration,
	} = useQuery({
		queryKey: ['taskDurationsData'],
		queryFn: () => getTaskDurationData(token),
		enabled: token !== '' && token !== undefined,
	})

	return (
		<div>
			<h1 className='title' onMouseDown={e => e.preventDefault(e)}>
				Front Page
				<form onClick={e => e.preventDefault(e)}>
					<label>
						User email
						<input
							type='email'
							value={emailValue}
							onChange={handleEmailChange}
							onMouseDown={e => e.stopPropagation(e)}></input>
					</label>
					<br />
					<label>
						Password
						<input
							type='password'
							value={passwordValue}
							onChange={handlePasswordChange}
							onMouseDown={e => e.stopPropagation(e)}></input>
					</label>
					<br />
					<button onClick={handleLoginButton}>Zaloguj</button>
				</form>
			</h1>
			<h3>{token !== '' && token !== undefined ? 'Token available' : 'Token missing'}</h3>
		</div>
	)
}
