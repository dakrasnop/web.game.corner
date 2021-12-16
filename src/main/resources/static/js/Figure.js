var Figure = Class.create({
	initialize: function(i, color, board) {
		this.color = color;
		this.id = 'fgr.' + color.truncate(2, '.') + i;
		this.htmlElement = new Element('div', {id:this.id, 'class':"figure"});
		this.htmlElement.style.width = cellWidth + 'px';
		this.htmlElement.style.height = cellWidth + 'px';
		if (color == "white") {
			this.htmlElement.insert(new Element('img', {'class':"figure-img", src:"/game/img/figure-w-t.png"}));
		} else {
			this.htmlElement.insert(new Element('img', {'class':"figure-img", src:"/game/img/figure-b-t.png"}));
		}

		this.htmlElement.observe("click", this.handleMouseClick.bind(this));
		this.htmlElement.observe("transitionend", this.handleTransitionEnd.bind(this));
		this.frozen = true;
		this.active = false;
		this.index = i;
		this.location = undefined;
		this.board = board;
		this.path = new Array();
	},

	handleMouseClick: function(event) {
		console.log("Figure:: Mouse click fired by " + event.element().id + "; x,y "
			+ event.pointer().x + ","+ event.pointer().y + "; frozen= " + this.frozen
			+ "; active= " + this.active
		);
		if (!this.frozen) {
			this.setActive();
			if (this.active) {
				this.board.setActiveFigure(this);
			}
		}
		event.stop();
	},
	
	moveTo(locations) {
		this.path = locations;
		this.htmlElement.style.transition= 'top 0.5s ease, left 0.5s ease';
		this.moveToStep(this.path.pop());
	},
	
	moveToStep: function(location) {
		console.log('>>> moveToStep :: ' + JSON.stringify(location) + '; top=' + parseInt(this.htmlElement.style.top) + '; left=' + parseInt(this.htmlElement.style.left));
		this.destCell= this.board.getCellByLocation(location);
		var di = location.i - this.location.i; //indexes[1];
		var dj = location.j - this.location.j; //indexes[2];
		var dx = di * (cellWidth + 4);
		var dy = dj * (cellWidth + 4);

		this.htmlElement.style.top= dy + 'px';
		this.htmlElement.style.left= dx + 'px';
	},

	handleTransitionEnd: function(event) {
		console.log('>>> 1.handleTransitionEnd ' + this.id + ':: ' +  JSON.stringify(this.path));
		if (this.path) {
			var te = this.path.pop();
//			console.log('>>> 2.handleTransitionEnd ' + this.id + ':: ' + JSON.stringify(te));
			if (te) {
				this.moveToStep(te);
				return;
			}
		}
		this.htmlElement.style.transition= 'none';
		this.htmlElement.style.top= '0px';
		this.htmlElement.style.left= '0px';
		this.destCell.htmlElement.insert(this.htmlElement);
		this.location = this.destCell.location;
		if (this.color == 'white') {
			this.board.continue_move();
		}
	},

	setActive: function() {
		if (this.active) {
			this.unsetActive();
		} else {
			this.active = true;
			this.htmlElement.style.animation= 'fadeIn 1s linear infinite';
		}
	},
	
	unsetActive: function() {
		this.active = false;
		this.htmlElement.style.animation= 'none';
		this.board.cellArray.forEach(e => {e.forEach(c => {c.unsetPossible();});});
		this.board.activeFigure = undefined;
	}
});
