/**
 * 
 */
var BoardCell = Class.create({
	initialize: function(i, j, board) {
		var klass;
		if ((i + j) % 2 == 0) {
			klass = 'cell odd';
		} else {
			klass = 'cell even';
		}
		this.htmlElement = new Element('div', {id:'i.' + i + '.' + j, 'class':klass});
		this.i = i;
		this.j = j;
		this.figure = undefined;
		this.board = board;
		this.htmlElement.observe("mouseup", this.handleMouseUp.bind(this));
	},
/*
	isHit: function(pointer) {
		var offset = this.htmlElement.cumulativeOffset();
		var dimension = this.htmlElement.getDimensions();
		if (pointer.x < offset.left || pointer.y < offset.top) {
			return false;
		}
		if ((pointer.x > offset.left + dimension.width) || (pointer.y > offset.top + dimension.height)) {
			return false;
		}
		return true;
	},
*/
	handleMouseUp: function(event) {
		var point = event.pointer();
//		console.log("BoardCell.handleMouseUp:: Mouse up on " + event.findElement("div").id 
//				+ "; this element (source): " + this.htmlElement.id
//				+ "; fired by " + event.element().id
//				+ "; source " + event.element().parentNode.id
//				+ "; x,y " + point.x + "," + point.y
//		);
		var boardOffset = this.board.htmlElement.cumulativeOffset();
//		console.log("BoardCell.handleMouseUp:: boardOffsets= " + boardOffset.left + ", " + boardOffset.top);
//		var thisOffset = this.htmlElement.cumulativeOffset();
//		console.log("BoardCell.handleMouseUp:: thisOffsets= " + thisOffset.left + ", " + thisOffset.top);
//		console.log("BoardCell.handleMouseUp:: destination= " + Math.floor((point.x - boardOffset.left)/52) + ", " + Math.floor((point.y - boardOffset.top)/52));
		var dimension = this.htmlElement.getDimensions();
//		console.log("BoardCell.handleMouseUp:: this dimension= " + dimension.width + ", " + dimension.height);
		
		var activeFig = event.element();
		if (activeFig.id.startsWith('fgr.w')) {  // NOTE only white figure is checked
			var source = this.htmlElement;
			var destinationX = Math.floor((point.x - boardOffset.left)/(dimension.width + 2)); // TODO make constant in constructor
			var destinationY = Math.floor((point.y - boardOffset.top)/(dimension.height + 2));
			if (destinationX < 0) destinationX = 0;
			if (destinationX > 7) destinationX = 7;
			if (destinationY < 0) destinationY = 0;
			if (destinationY > 7) destinationY = 7;
			var destinationId = 'i.' + destinationX + '.' + destinationY;
			new Ajax.Request('/game/humanmove',{
				method: 'get',
				parameters: {source: source.id, destination: destinationId, figureId: activeFig.id},
				requestHeaders: {Accept: 'application/json'},
				onSuccess: (function(transport){this.board.make_move(transport, activeFig, $(destinationId))}).bind(this)
			});
			for (var k = 0; k < 9; k++) {
				this.board.white[k].frozen = true;
			};
		}
		event.stop();
	}

});
