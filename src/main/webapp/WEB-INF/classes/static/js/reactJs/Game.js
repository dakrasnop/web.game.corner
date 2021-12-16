/**
 * 
 */
'use strict';

class Game extends React.Component {
	constructor(props) {
		super(props);
		if (props.restore) {
			this.handleRestore();
		}
		this.state = {visibility: 'hidden', message: '*'};
	}
	
	handleRestore() {
		let myHeaders = new Headers();
		myHeaders.append('Accept', 'application/json');
		let req = new Request('/game/restoregame', {method: 'GET', headers: myHeaders});
		fetch(req)
			.then(res => res.json())
			.then(
				this.onRestore,
				(error) => {
					console.log('AJAX error: ' + JSON.stringify(error));
				}
			);
	}

	handleMouseClick(event) {
		let myHeaders = new Headers();
		myHeaders.append('Accept', 'application/json');
		let req = new Request('/game/newgame', {method: 'GET', headers: myHeaders});
		fetch(req)
			.then(res => res.json())
			.then(
				this.onSuccess,
				(error) => {
					console.log('AJAX error: ' + JSON.stringify(error));
				}
			);
	}

	onRestore = (json) => {
		console.log("Game::handleRestore: " + json.white[0] + ";" + json.black[1]);
		if (this.boardElement) {
			this.boardElement.newGame(json);
		}
	}
	
	onSuccess = (json) => {
		console.log("receive: " + json.white[0] + ";" + json.black[1]);
		this.boardElement.newGame(json);
	}
	
	showAnnouncement = (vsbty, msg) => {
		console.log('>>> Game.showAnnouncement() :: ' 
			+ ReactDOM.findDOMNode(this.boardElement).offsetLeft
			+ ',' + ReactDOM.findDOMNode(this.boardElement).offsetTop
			+ '  ' + ReactDOM.findDOMNode(this.boardElement).offsetWidth
			+ ',' + ReactDOM.findDOMNode(this.boardElement).offsetHeight
			+ '  ' + ReactDOM.findDOMNode(this.boardElement).offsetParent.offsetLeft
			+ ',' + ReactDOM.findDOMNode(this.boardElement).offsetParent.offsetLeft
			)
		this.setState({visibility: vsbty, message: msg});
	}
	
	render() {
		return e(
			'div',
			{
				id: 'table',
				style:{width:this.props.size+'px', height:this.props.size+'px'}
			},
			[
				e(Board, 
					{
						ref: (instance) => {this.boardElement = instance;},
						showAnnouncement: this.showAnnouncement,
						key: 1
					}),
				e(Button,
					{
						onClick: () => this.handleMouseClick(),
						key: 2
					}),
				e(Announcement,
					{
						visibility: this.state.visibility, 
						message: this.state.message,
						key: 3
					}),
				e('div',
					{
						id: 'copyright',
						className: 'copyright',
						key: 4
					},
					`©AKrasnopolski 2021 v 0.0.1 (React)`
				)
			]
		)
	}
}