var Board = Class.create({
	initialize: function(parent) {
		this.htmlElement = new Element('div', {id:'board', 'class':'board'});
		$(parent).insert(this.htmlElement);
		this.BoardCellArray = new Array();
		for (var j = 0; j < 8; j++) {
			var row = new Element('div', {id:'r.' + j, 'class':'row'});
			this.BoardCellArray.push(new Array());
			this.htmlElement.insert(row);
			for (var i = 0; i < 8; i++) {
				var cell = new BoardCell(i, j, this);
				row.insert(cell.htmlElement);
				this.BoardCellArray[j].push(cell);
			}
		}

		this.black = new Array();
		this.white = new Array();
		for (var i = 0; i < 9; i++) {
			this.black.push(new Figure(i, 'black'));
		};
		for (var i = 0; i < 9; i++) {
			this.white.push(new Figure(i, 'white'));
		}
		this.announcement =  new Element('div', {id:'announcement', 'class':'announcement'});
		this.htmlElement.insert(this.announcement);
		this.announcement.hide();
		this.gameOver = false;
	},

	make_move: function(transport, activeFig, destination) {
		var json = transport.responseText.evalJSON(true);
		console.log('Board:: make_move: destination: ' + destination.id + '  json.allow: ' + json.allow + '  json.win: ' + json.win);
		if (json.allow) {
			childs = destination.childElements();
			if (childs.length == 0 || (!childs[0].id.startsWith('fgr.'))) {
				destination.insert(activeFig.remove());
			}
			if (json.win) {
				this.show_announcement('You win !!!');
				this.gameOver = true;
			} else {
				new Ajax.Request('/game/computermove',{
					method: 'get',
					requestHeaders: {Accept: 'application/json'},
					onSuccess: (function(transport){this.computer_move(transport);}).bind(this)
				});
			}
		} else {
			for (var k = 0; k < 9; k++) {
				this.white[k].frozen = false;
			};
		}
		activeFig.setStyle({
			left: '0',
			top: '0',
			position: 'relative',
		});
	},
	
	computer_move: function(transport) {
		var json = transport.responseText.evalJSON(true);
		console.log('Board:: computer move: start= ' + json.start + '  finish= ' + json.finish + '  Fig_idx: ' + json.figIdx + '  win: ' + json.win);
		var figElem = this.black[json.figIdx].htmlElement;
		figElem.remove();
		this.BoardCellArray[json.finish[1]][json.finish[0]].htmlElement.insert(figElem); // Attention: BoardCellArray[y][x]
		if (json.win) {
			this.show_announcement('You lost.');
			this.gameOver = true;
		} else {
			for (var k = 0; k < 9; k++) {
				this.white[k].frozen = false;
			};
		}
	},
	
	clean_board: function() {
		/**/
	},
	
	init_position: function(json) {
		var white_coord = json.white;
		var black_coord = json.black;
		for (var i = 0; i < 9; i++) {
			var x = white_coord[i][0];
			var y = white_coord[i][1];
			var cell = $('i.' + x + '.' + y);
//			alert('init_position: i=' + i + 'x,y=' + x + ',' + y + '  cell id=' + cell.id);
			cell.insert(this.white[i].htmlElement);
			this.white[i].htmlElement.show();
			this.white[i].frozen = false;
		};
		for (var i = 0; i < 9; i++) {
			var x = black_coord[i][0];
			var y = black_coord[i][1];
			var cell = $('i.' + x + '.' + y);
			cell.insert(this.black[i].htmlElement);
			this.black[i].htmlElement.show();
		};
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
