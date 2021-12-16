var Board = Class.create({
	initialize: function(parent) {
		this.htmlElement = new Element('div', {id:'board', 'class':'board'});
		$(parent).insert(this.htmlElement);
		
//		this.cellArray = Array.from(Array(8), () => new Array(8));
		this.cellArray = Array(8).fill().map(() => Array(8));
//		for (var j = 0; j < 8; j++) {
//			this.cellArray[j] = new Array(); 
//		}
		for (var j = 0; j < 8; j++) {
			var row = new Element('div', {id:'r.' + j, 'class':'row'});
			this.htmlElement.insert(row);
			for (var i = 0; i < 8; i++) {
				var cell = new BoardCell(i, j, this);
				this.cellArray[i][j] = cell;
				row.insert(cell.htmlElement);
			}
		}

		this.black = new Array();
		this.white = new Array();
		for (var i = 0; i < 9; i++) {
			this.black[i] = new Figure(i, 'black', this);
			this.white[i] = new Figure(i, 'white', this);
		};

		this.announcement =  new Element('div', {id:'announcement', 'class':'announcement'});
		this.htmlElement.insert(this.announcement);
		this.announcement.hide();
		this.gameOver = false;
		this.activeFigure = undefined;
		
		this.gamePosition = new GamePosition();
		this.gamePosition.init();
	},

	getCellByLocation: function(location) {
		return this.cellArray[location.i][location.j];
	},
	
	setActiveFigure: function(figure) {
		console.log('Board::setActiveFigure figure= ' + figure.id);
		if (this.activeFigure) {
			console.log('Board::setActiveFigure activeFigure= ' + this.activeFigure.id);
			if (this.activeFigure == figure) return;
			this.activeFigure.unsetActive();
			this.activeFigure = undefined;
		}
		this.activeFigure = figure;
		this.pm = this.gamePosition.generatePossibleDestinationsForLocation(figure.location);
		this.cellArray.forEach(e => {e.forEach(c => {c.unsetPossible();});});
		this.pm.forEach(e => {console.dir(JSON.stringify(e)); var cell = this.getCellByLocation(e); cell.setPossible();});
	},

	make_move: function(transport, destination, move) {
		var json = transport.responseText.evalJSON(true);
		this.win = json.win;
		console.log('Board:: make_move: destination: ' + destination.id + '  json.allow: ' + json.allow + '  json.win: ' + json.win + ' move= ' + move);
		if (json.allow) {
			childs = destination.htmlElement.childElements();
			if (childs.length == 0 || (!childs[0].id.startsWith('fgr.'))) {
				var path = this.gamePosition.findStepsForMove(move);
				this.gamePosition.applyMove(move);

				this.activeFigure.moveTo(path);

				this.getCellByLocation(move.from).figure = undefined;
				this.getCellByLocation(move.to).figure = this.activeFigure;

//				console.table(this.gamePosition.cellStates);
			}
		} else {
			for (var k = 0; k < 9; k++) {
				this.white[k].frozen = false;
			};
			this.activeFigure.unsetActive();
		}
	},
	
	continue_move: function() {
		console.log('Board:: continue_move win= ' + this.win);
		if (this.win) {
			this.show_announcement('You win !!!');
			this.gameOver = true;
		} else {
			new Ajax.Request('/game/computermove',{
				method: 'get',
				requestHeaders: {Accept: 'application/json'},
				onSuccess: (function(transport){this.computer_move(transport);}).bind(this)
			});
		}
		this.activeFigure.unsetActive();
	},

	computer_move: function(transport) {
		var json = transport.responseText.evalJSON(true);
		console.log('Board:: computer move: start= ' + json.start + '  finish= ' + json.finish + '  Fig_idx: ' + json.figIdx + '  win: ' + json.win);
		var figure = this.black[json.figIdx];
		var sourceLocation = new Location(json.start[0], json.start[1]);
		var destLocation = new Location(json.finish[0], json.finish[1]);

		var move = new Move(sourceLocation, destLocation);
		var path = this.gamePosition.findStepsForMove(move);
		
		path.forEach(e => {this.getCellByLocation(e).setPossible();});
		this.getCellByLocation(sourceLocation).setPossible();
		
		this.gamePosition.applyMove(move);

		figure.moveTo(path);

		this.getCellByLocation(sourceLocation).figure = undefined;
		this.getCellByLocation(destLocation).figure = figure;

//		console.table(this.gamePosition.cellStates);
		
		if (json.win) {
			this.show_announcement('You lost.');
			this.gameOver = true;
			this.cellArray.forEach(e => {e.forEach(c => {c.unsetPossible();});});
		} else {
			for (var k = 0; k < 9; k++) {
				this.white[k].frozen = false;
			};
		}
	},
	
	clean_board: function() {
		/**/
	},
	
	set_position: function(json) {
		var white_coord = json.white;
		for (var i = 0; i < 9; i++) {
			var x = white_coord[i][0];
			var y = white_coord[i][1];
			var cell = this.cellArray[x][y]; //$('i.' + x + '.' + y);
			cell.htmlElement.insert(this.white[i].htmlElement);
			this.white[i].location = new Location(x, y);
			cell.figure = this.white[i];
			this.white[i].htmlElement.show();
			this.white[i].frozen = false;
		};

		var black_coord = json.black;
		for (var i = 0; i < 9; i++) {
			var x = black_coord[i][0];
			var y = black_coord[i][1];
			var cell =  this.cellArray[x][y]; //$('i.' + x + '.' + y);
			cell.htmlElement.insert(this.black[i].htmlElement);
			this.black[i].location = new Location(x, y);
			cell.figure = this.black[i];
			this.black[i].htmlElement.show();
		};

		this.gamePosition.setPosition(json);
		this.announcement.hide();
		this.gameOver = false;
	},
	
	show_announcement: function(message) {
		var offset = this.htmlElement.cumulativeOffset();
		var dimension = this.htmlElement.getDimensions();
		this.announcement.update(message);
		this.announcement.setStyle({
			left: (offset.left + dimension.width/2 - this.announcement.getWidth()/2) + 'px',
			top: (offset.top + dimension.height/2) + 'px',
		});
		this.announcement.show();
	},
	
});
