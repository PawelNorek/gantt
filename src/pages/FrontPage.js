import React from 'react'
// import { useEffect } from 'react'
import { useState } from 'react'
import settings from '../settings'

export default function FrontPage({ token, setToken }) {
	const [emailValue, setEmailValue] = useState('')
	const [passwordValue, setPasswordValue] = useState('')

	// useEffect(() => {
	// 	token && setToken(token)
	// }, [token, setToken])

	function handleEmailChange(e) {
		setEmailValue(e.target.value)
	}

	function handlePasswordChange(e) {
		setPasswordValue(e.target.value)
	}

	function handleLoginButton() {
		let myHeaders = new Headers()
		myHeaders.append('Content-Type', 'application/json')

		let raw = JSON.stringify({
			email: emailValue,
			password: passwordValue,
		})

		fetch(`https://${settings.host}/api/v1/auth/user/signin`, {
			method: 'POST',
			headers: myHeaders,
			body: raw,
		})
			.then(response => response.json())
			.then(data => setToken(data.token))
			.catch(error => console.log(error))
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
					<button onClick={handleLoginButton}>Zaloguj</button>
				</form>
			</h1>
			<h3>{token !== '' ? 'Token available' : 'Token missing'}</h3>
		</div>
	)
}
