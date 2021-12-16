var Button = Class.create({
	initialize: function(parent, board) {
		this.htmlElement = new Element('input', {id:'newgame', class:'button', type:'button', value:'New Game'});
		$(parent).insert(this.htmlElement);
		this.board = board;
		this.htmlElement.observe("click", this.handleMouseClick.bind(this));
	},

	handleMouseClick: function(event) {
		new Ajax.Request('/game/newgame',{
			method: 'get',
			requestHeaders: {Accept: 'application/json'},
			onSuccess: (function(transport){this.onSuccess(transport);}).bind(this)
		});
	},

	onSuccess: function(transport) {
		var json = transport.responseText.evalJSON(true);
//		console.log("receive: " + json.white[0] + ";" + json.black[1]);
		this.board.clean_board();
		this.board.set_position(json);
	}	
});
