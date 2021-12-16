'use strict';

const e = React.createElement;
const r8 = [0, 1, 2, 3, 4, 5, 6, 7];

class Board extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			path: undefined,
			gameOver:false,
			gamePosition:new GamePosition(),
			activeFigure:undefined
		};
	}

	newGame = (json) => {
		this.state.gamePosition.setPosition(json);
		this.props.showAnnouncement('hidden', '');
//		this.props.showAnnouncement('visible', 'TEST');
		this.frozen = false;
		this.setState({gameOver:false});
	}

	handleMouseClickCell(e, i, j) {
		e.stopPropagation();
//		console.log("Board.handleMouseClickCell:: Mouse click on Cell i=" + i 
//				+ "; j=" + j
//		);
		if (this.state.activeFigure) { 
			let sourceLocation = this.state.activeFigure;
			let sourceId = 'i.' + sourceLocation.i + '.' + sourceLocation.j;
			let destinationLocation = new Location(i, j);
			let destinationId = 'i.' + i + '.' + j;
			let move = new Move(sourceLocation, destinationLocation);
			let figureId = this.state.gamePosition.getState(sourceLocation).fgrId;

			let myHeaders = new Headers();
			myHeaders.append('Accept', 'application/json');
			let url = '/game/humanmove?source=' + sourceId 
				+ '&destination=' + destinationId
				+ '&figureId=' + figureId;
			let req = new Request(url, {method: 'GET', headers: myHeaders});
			fetch(req)
				.then(res => res.json())
				.then(
					(json) => {this.make_move(json, move)},
					(error) => {
						console.log('AJAX error: ' + JSON.stringify(error));
					}
				);
			this.frozen = true;
		}
	}

	handleMouseClickFigure(e, i, j) {
		e.stopPropagation();
//		console.log("Board.handleMouseClickFigure:: Mouse click on Figure i=" + i + "; j=" + j
//			+ ' active=' + this.state.activeFigure);
		let currentLocation = new Location(i, j);
		let figColor = this.state.gamePosition.getState(currentLocation).figure;
		if (!this.frozen && figColor == WHITE) {
			if (!this.state.activeFigure) {
/* Enter activeFigure == undefined*/
				let pm = this.state.gamePosition.generatePossibleDestinationsForLocation(currentLocation);
				this.setState((state) => {
					state.gamePosition.getState(currentLocation).active = true;
					state.gamePosition.cellStates.forEach(e => {e.forEach(c => {c.possible = false; c.traceable = false;});}); //clean up all cells
					pm.forEach(e => {
//						console.dir(JSON.stringify(e)); 
						state.gamePosition.getState(e).possible = true;
					});
					return {
						activeFigure: currentLocation
					}
				});
			} else {
/* Enter activeFigure == other or same*/
				if (this.state.activeFigure.equals(currentLocation)) {
/* Enter activeFigure == the same */
				this.setState((state) => {
					state.gamePosition.getState(state.activeFigure).active = false;
					state.gamePosition.cellStates.forEach(e => {e.forEach(c => {c.possible = false; c.traceable = false;});}); //clean up all cells
					return {
						activeFigure: undefined
					};
				});
				} else {
/* Enter activeFigure == other */
				let pm = this.state.gamePosition.generatePossibleDestinationsForLocation(currentLocation);
				this.setState((state) => {
					state.gamePosition.getState(state.activeFigure).active = false;
					state.gamePosition.getState(currentLocation).active = true;
					state.gamePosition.cellStates.forEach(e => {e.forEach(c => {c.possible = false; c.traceable = false;});}); //clean up all cells
					pm.forEach(e => {
//						console.dir(JSON.stringify(e)); 
						state.gamePosition.getState(e).possible = true;
					});
					return {
						activeFigure: currentLocation
					};
				});
				}
			}
		}
	}
	
	make_move(json, move) {
		this.win = json.win;
//		console.log('Board:: make_move: json.allow: ' + json.allow + '  json.win: ' + json.win + ' move= ' + move);
		if (json.allow) {
			if (this.state.gamePosition.getState(move.to).figure == EMPTY) {
				let path = this.state.gamePosition.findStepsForMove(move);

				this.setState({});
				this.move = move;
				if (this.cellRef) {
					this.cellRef.startMove(path);
				};
			}
		} else {
			this.frozen = false;
			this.setState((state) => {
				state.gamePosition.getState(move.from).active = false;
				state.gamePosition.cellStates.forEach(
					e => {e.forEach(
						c => {c.possible = false; c.traceable = false;}); //clean up all cells
					});
				return {activeFigure: undefined};
			});
		}
	}

	continue_move = () => {
//		console.log('Board:: continue_move win= ' + this.win);
		this.setState(
			(state) => {
				state.gamePosition.applyMove(this.move);
				state.gamePosition.cellStates.forEach(
					e => {e.forEach(
						c => {c.possible = false; c.traceable = false;}); //clean up all cells
					});
				return {activeFigure: undefined};
		});
		
		if (this.win) {
			this.props.showAnnouncement('visible', 'You win !!!');
			this.setState({gameOver:true});
		} else {
			let myHeaders = new Headers();
			myHeaders.append('Accept', 'application/json');
			let req = new Request('/game/computermove', {method: 'GET', headers: myHeaders});
			fetch(req)
				.then(res => res.json())
				.then(
					(json) => {this.computer_move(json)},
					(error) => {
						console.log('AJAX error: ' + JSON.stringify(error));
					}
				);
		}
	}

	computer_move = (json) => {
		this.win = json.win;
		console.log('Board:: computer move: start= ' + json.start + '  finish= ' + json.finish 
			+ '  Fig_idx: ' + json.figIdx + '  win: ' + json.win);
		var sourceLocation = new Location(json.start[0], json.start[1]);
		var destLocation = new Location(json.finish[0], json.finish[1]);

		var move = new Move(sourceLocation, destLocation);
		var path = this.state.gamePosition.findStepsForMove(move);
		
		this.setState(
			(state) => {
				path.forEach(e => {state.gamePosition.getState(e).traceable = true;});
				state.gamePosition.getState(destLocation).traceable = true;
				return {activeFigure: sourceLocation};
			});

			this.move = move;
			if (this.cellRef) {
				this.cellRef.startMove(path);
			};
	}

	continue_computer_move = () => {
		this.setState(
			(state) => {
				state.gamePosition.applyMove(this.move);
				return {activeFigure: undefined};
			});
		
		if (this.win) {
			this.props.showAnnouncement('visible', 'You lost.');
			this.setState({gameOver:true});
		} else {
			this.frozen = false;
		}
	}
	
	render() {
		let out = '';
		if (this.state.activeFigure) {
			out = this.state.activeFigure.i + '.' + this.state.activeFigure.j;
		}
		console.log(">>> Board.render ::" 
			+ ' activeFig=' + out);
		let rows = r8.map((j) =>
				{
					let cells =
					r8.map((i) => {
						let cstt = this.state.gamePosition.cellStates[i][j];
						let properties = {
							i:i, 
							j:j, 
							onCellClick:(e,x,y) => this.handleMouseClickCell(e, x, y),
							onFigureClick:(e,x,y) => this.handleMouseClickFigure(e, x, y),
							cellState: Object.assign({}, cstt),
							key:i
						};
						if (this.state.activeFigure && this.state.activeFigure.equals(new Location(i,j))) {
//							properties.path = this.state.path;
							properties.ref = (instance) => {this.cellRef = instance;};
							let color = cstt.figure;
							if (color == WHITE) {
								properties.continueCallBack = () => {this.continue_move()};
							} else if (color == BLACK) {
								properties.continueCallBack = () => {this.continue_computer_move()};
							}
						}
						return e(BoardCell, 
										properties,
										null);
					});
					return e('div', {id:'r.j'+j, className:'row', key:j}, cells);
				})
		return e(
			'div',
			{id:'board', className:'board'},
			rows
		);
	}
}
