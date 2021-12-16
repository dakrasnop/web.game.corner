'use strict';

class Button extends React.Component {
	constructor(props) {
		super(props);
	}

	
	render() {
		return e('div', {style:{clear:'left', padding:'4px'}},
		e(
			'input',
			{
				id:'newgame', 
				className:'button', 
				type:'button', 
				value:'New Game',
				onClick:this.props.onClick,
			},
			null
		));
	}
	
};
