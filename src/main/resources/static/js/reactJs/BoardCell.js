'use strict';

/**
 * @typedef {event} NewType
 */

class BoardCell extends React.Component {
	constructor(props) {
		super(props); // i, j, cellState, onCellClick, onFigureClick, path, continueCallBack
		if ((props.i + props.j) % 2 == 0) {
			this.klass = 'cell odd';
		} else {
			this.klass = 'cell even';
		}
		this.id = 'i.' + props.i + '.' + props.j;
	}

	startMove(path) {
		if (this.figRef) {
			this.figRef.startMove(path);
		};
	}
	
	shouldComponentUpdate(nextProps, nextState) {
		if (this.props.cellState.figure !== nextProps.cellState.figure) {
			return true;
		}
		if (this.props.cellState.active !== nextProps.cellState.active) {
			return true;
		}
		if (this.props.cellState.possible !== nextProps.cellState.possible) {
			return true;
		}
		if (this.props.cellState.traceable !== nextProps.cellState.traceable) {
			return true;
		}
		if (this.props.continueCallBack !== nextProps.continueCallBack) {
			return true;
		}
		return false;
	}

	render() {
		let cellState = this.props.cellState;
		console.log(">>> BoardCell.render " 
			+ cellState.figure + "; "
			+ cellState.active + "; "
			+ cellState.possible + "; "
			+ cellState.traceable);
		let color = undefined;
		switch (cellState.figure) {
			case WHITE:
				color = 'white';
				break;
			case BLACK:
				color = 'black';
				break;
			case EMPTY:
				color = undefined;
		}
		let fig = (!color)? null : e(Figure, {
					ref:(instance) => {this.figRef = instance;},
					id:cellState.fgrId,
					i:this.props.i,
					j:this.props.j,
					onClick:this.props.onFigureClick,
					continueCallBack:this.props.continueCallBack,
					color:color,
					active:cellState.active // ???? for black?
				}, null);

		let anim = 'none';
		if (cellState.possible) {
			let isOdd = (this.props.i + this.props.j) % 2 == 0;
			anim = ((isOdd)?'possibleOdd':'possibleEven') + ' 0.5s linear infinite';
		}
		if (cellState.traceable) {
			anim = 'traceable 1.5s linear infinite';
		}
		return e(
			'div',
			{
				id:this.id, className:this.klass,
				onClick:(e) => this.props.onCellClick(e, this.props.i, this.props.j),
				style:{width:cellWidth+'px', height:cellWidth+'px', animation: anim}
			},
			fig
		);
	}
}
