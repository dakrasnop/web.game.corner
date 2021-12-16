var Figure = Class.create({
	initialize: function(i, color) {
		this.htmlElement = new Element('div', {id:'fgr.' + color.truncate(2, '.') + i, 'class':color + " figure"});
		this.htmlElement.observe("mouseup", this.handleMouseUp.bind(this));
		this.htmlElement.observe("mousedown", this.handleMouseDown.bind(this));
		this.htmlElement.observe("mousemove", this.handleMouseMove.bind(this));
		this.htmlElement.observe("mouseout", this.handleMouseOut.bind(this));
		this.isMouseDown = 0;
		this.frozen = true;
		this.cursorOffset = new Object();
		this.htmlElement.figure='Figure';
		this.index = i;
	},

	handleMouseDown: function(event) {
		console.log("Figure:: Mouse down fired by " + event.element().id + "; x,y " + event.pointer().x + ","+ event.pointer().y + "; frozen= " + this.frozen);
		if (!this.frozen) {
			this.isMouseDown = 1;
			var point = event.pointer();
			var offset = this.htmlElement.viewportOffset();
			this.cursorOffset.x = point.x - parseInt(offset.left); // relative location of mouse's cursor
			this.cursorOffset.y = point.y - parseInt(offset.top);
//		alert("Figure:: Mouse down fired by " + event.element().id + " xdown=" + this.xdown
//			+ ' ydown=' + this.ydown + ' event.X=' + event.pointerX() + ' event.Y=' + event.pointerY());
			this.htmlElement.setStyle({
				left: parseInt(offset.left) + 'px',
				top: parseInt(offset.top) + 'px',
				position: 'absolute',
				opacity: 0.5,
				
				zIndex: 22,
			});
		}
		event.stop();
	},

	handleMouseMove: function(event) {
		if (this.isMouseDown == 1) {
//		alert('Figure:: Mouse move xdown=' + this.xdown + ' even.X=' + event.pointerX());
			var point = event.pointer();
			this.htmlElement.setStyle({
				left: point.x - this.cursorOffset.x + 'px',
				top: point.y - this.cursorOffset.y + 'px',
			});
		}
		event.stop();
	},

	handleMouseUp: function(event) {
		console.log("Figure:: Mouse up fired by " + event.element().id + "; x,y " + event.pointer().x + ","+ event.pointer().y + "; frozen= " + this.frozen);
		if (!this.frozen) {
			this.htmlElement.style.zIndex = 21;
			this.htmlElement.style.opacity = 1;
			this.isMouseDown = 0;
		} else {
			event.stop();
		}
	},
	
	handleMouseOut: function(event) {
		this.isMouseDown = 0;
		this.htmlElement.setStyle({
			left: '0',
			top: '0',
			position: 'relative',
			opacity: 1,
			zIndex: 21,
		});
	}
});
