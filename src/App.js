import './App.css'
import GanttChart from './components/GanttChart/GanttChart'
import { BrowserRouter, Navigate, NavLink, Route, Routes } from 'react-router-dom'
import FrontPage from './pages/FrontPage'
import { useState } from 'react'

function App() {
	const [token, setToken] = useState('')

	return (
		<div className='App' onMouseDown={e => e.preventDefault(e)}>
			<BrowserRouter>
				<nav>
					<h1>Project tracker</h1>
					<NavLink to='/'>Front Page</NavLink>
					<NavLink to='/gantt'>Gantt Chart</NavLink>
				</nav>
				<Routes>
					<Route path='/' element={<FrontPage token={token} setToken={setToken} />} />
					<Route path='/gantt' element={<GanttChart token={token} />} />
					<Route path='*' element={<Navigate to='/' replace />} />
				</Routes>
			</BrowserRouter>
		</div>
	)
}

export default App
