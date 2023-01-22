import React from 'react'

export default function FrontPage() {
	return (
		<div>
			<h1 className='title' onMouseDown={e => e.preventDefault(e)}>
				Front Page
			</h1>
		</div>
	)
}
