/**
 * 
 */
'use strict';

class Announcement extends React.Component {
	constructor(props) {
		super(props);
//		console.log('>>> Announcement.constructor() :: ' + props.board.offsetLeft)
	}

	render() {
		return e(
			'div',
			{
//				id:'announcement', 
				className:'announcement', 
				style:{
					visibility:this.props.visibility,
					top: -282,
					left: 122
				}
			},
			`${this.props.message}`
		);
	}
	
};
