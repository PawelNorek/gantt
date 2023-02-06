import Xarrow from 'react-xarrows'

export function RenderArrows({ arrows }) {
	// console.log(arrows)
	return arrows.map(arrow => {
		return (
			<Xarrow key={arrow.Id} start={arrow.start} end={arrow.end} startAnchor='bottom' endAnchor='left' path='grid' />
		)
	})
}
