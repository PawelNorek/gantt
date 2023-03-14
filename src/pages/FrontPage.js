import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { getToken } from '../api/dataQuery'

export default function FrontPage({ token, setToken }) {
	const [emailValue, setEmailValue] = useState('')
	const [passwordValue, setPasswordValue] = useState('')
	const [testValue, setTestValue] = useState('')

	function handleEmailChange(e) {
		setEmailValue(e.target.value)
	}

	function handlePasswordChange(e) {
		setPasswordValue(e.target.value)
	}

	function handleLoginButton() {
		getToken(emailValue, passwordValue)
			.then(data => {
				setToken(data.token)
				console.log('token')
				// document.cookie = `gantt-cookie=${data.token}; max-age=300; samesite=strict; secure`
				document.cookie = `gantt-cookie=${data.token}; max-age=300;`
			})
			.catch(data => console.log('error:', data))
	}

	useEffect(() => {
		const cookieValue = document.cookie
			.split('; ')
			.find(row => row.startsWith('gantt-cookie='))
			?.split('=')[1]
		if (cookieValue) {
			setToken(cookieValue)
		}
	})

	useEffect(() => {
		setInterval(() => {
			const cookieValue = document.cookie
				.split('; ')
				.find(row => row.startsWith('gantt-cookie='))
				?.split('=')[1]
			if (cookieValue) {
				document.cookie = `gantt-cookie=${cookieValue}; max-age=300; same-siete=strict; secure`
				setToken(cookieValue)
			}
		}, 1000 * 4 * 60)
	})

	useEffect(() => {
		const timer = setTimeout(() => {
			console.log('test', timer)
		}, 1000)
		return () => {
			console.log('return', timer)
			clearTimeout(timer)
		}
	}, [testValue])

	function handleTestChange(e) {
		setTestValue(e.target.value)
	}

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
					<label>
						Test
						<input value={testValue} onChange={handleTestChange} onMouseDown={e => e.stopPropagation(e)}></input>
					</label>

					<br />
					<button onClick={handleLoginButton}>Zaloguj</button>
				</form>
			</h1>
			<h3>{token !== '' && token !== undefined ? 'Token available' : 'Token missing'}</h3>
		</div>
	)
}
