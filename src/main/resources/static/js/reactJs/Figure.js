'use strict';

class Figure extends React.Component {
	constructor(props) { //id, i, j, color, onClick, continueCallBack
		super(props);

		this.state = {
			location:new Location(props.i, props.j),
			top: 0,
			left: 0
		};
		this.handleTransitionEnd = this.handleTransitionEnd.bind(this);
	}

	startMove(path) {
//		console.log(' >>> Figure::startMove [' 
//			+ this.props.id +'] path=' 
//			+ path + ', ' 
//			+ typeof(path) + ', ' + (path instanceof Array)
//			+ ' callback: ' + this.props.continueCallBack
//		);
		if (!path || (path == null) || (path.length == 0)) return;
		console.log(' >>> Figure::startMove path[0]= i:' + path[0].i + ' j:' + path[0].j);
		this.path = path;
		this.setState(
			{transition: 'top 0.5s ease, left 0.5s ease'}
		);
		this.moveToStep(this.path.pop());
	}
	
	moveToStep(location) {
//		console.log(' >>> Figure::moveToStep :: ' + JSON.stringify(location) 
//			+ '; top=' + parseInt(this.state.top) 
//			+ '; left=' + parseInt(this.state.left)
//		);

		var di = location.i - this.state.location.i; //indexes[1];
		var dj = location.j - this.state.location.j; //indexes[2];
		var dx = di * (cellWidth + 4);
		var dy = dj * (cellWidth + 4);

		this.setState(
			{top: dy + 'px', left: dx + 'px'}
		);
	}

	handleTransitionEnd(event) {
//		console.log('>>> 1.handleTransitionEnd ' 
//			+ this.props.id + ':: path:' +  JSON.stringify(this.path)
//			+ ' callback: ' + this.props.continueCallBack
//		);
		if (this.path) {
			var te = this.path.pop();
//			console.log('>>> 2.handleTransitionEnd ' + this.id + ':: ' + JSON.stringify(te));
			if (te) {
				this.moveToStep(te);
				return;
			}
		}
		this.setState(
			{top: 0, left: 0, transition: 'none'}
		);
		if (this.props.continueCallBack) {
			this.props.continueCallBack();
		}
	}
/*
	shouldComponentUpdate(nextProps, nextState) {
		if (this.props.active !== nextProps.active) {
			return true;
		}
		return false;
	}
*/
	render() {
		console.log(">>> Figure.render active=" + this.props.active
			+ ' callback: ' + this.props.continueCallBack
		);

		var anim;
		let klass;
		if (this.props.color == "white") {
			klass = 'figure-img-w';
			anim = (this.props.active)?'fadeIn 1s linear infinite':'none';
		} else {
			klass = 'figure-img-b';
			anim = 'none';
		}

		return e(
			'div',
			{
				id:this.props.id, 
				className:'figure',
				onClick:(e) => this.props.onClick(e, this.props.i, this.props.j),
				onTransitionEnd:this.handleTransitionEnd,
				style:{
					width:cellWidth+'px', 
					height:cellWidth+'px', 
					animation: anim,
					transition: this.state.transition,
					top: this.state.top,
					left: this.state.left
				}
			},
			e(
				'img', 
				{
					className: klass 
				})
		);
	}
}
