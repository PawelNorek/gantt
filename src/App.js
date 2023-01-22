import './App.css'
import GanttChart from './components/GanttChart/GanttChart'
import { BrowserRouter, Navigate, NavLink, Route, Routes } from 'react-router-dom'
import FrontPage from './pages/FrontPage'

function App() {
	return (
		<div className='App'>
			<BrowserRouter>
				<nav>
					<h1>Project tracker</h1>
					<NavLink to='/'>Front Page</NavLink>
					<NavLink to='/gantt'>Gantt Chart</NavLink>
				</nav>
				<Routes>
					<Route path='/' element={<FrontPage />} />
					<Route path='/gantt' element={<GanttChart />} />
					<Route path='*' element={<Navigate to='/' replace />} />
				</Routes>
			</BrowserRouter>
		</div>
	)
}

export default App
