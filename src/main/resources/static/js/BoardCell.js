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
		this.id = 'i.' + i + '.' + j;
		this.htmlElement = new Element('div', {id:this.id, 'class':klass});
		this.htmlElement.style.width = cellWidth + 'px';
		this.htmlElement.style.height = cellWidth + 'px';
		this.i = i;
		this.j = j;
		this.location = new Location(i, j);
		this.figure = undefined;
		this.board = board;
		this.htmlElement.observe("click", this.handleMouseClick.bind(this));
		this.borderColor = this.htmlElement.style.borderColor;
	},

	handleMouseClick: function(event) {
		console.log("BoardCell.handleMouseClick:: Mouse click " + event.findElement("div").id 
				+ "; this element (source): " + this.htmlElement.id
				+ "; fired by " + event.element().id
		);

		if (this.board.activeFigure) { 
			var sourceLocation = this.board.activeFigure.location;
			var source = this.board.getCellByLocation(sourceLocation);
			var move = new Move(sourceLocation, this.location);

//			console.log("BoardCell:: handleMouseClick : source= " + source.id);
			new Ajax.Request('/game/humanmove',{
				method: 'get',
				parameters: {source: source.id, destination: this.id, figureId: this.board.activeFigure.id},
				requestHeaders: {Accept: 'application/json'},
				onSuccess: (function(transport){this.board.make_move(transport, this, move)}).bind(this)
			});
			for (var k = 0; k < 9; k++) {
				this.board.white[k].frozen = true;
			}
		}
		event.stop();
	},
	
	setPossible: function() {
//		this.htmlElement.style.borderColor = '#ffaabb';
		this.htmlElement.style.animation= 'possible 0.5s linear infinite';
	},
	
	unsetPossible: function() {
//		this.htmlElement.style.borderColor = this.borderColor;
		this.htmlElement.style.animation= 'none';
	}

});
