cellWidth = 0;

function start(restore) {
	var ismobile = (navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i)) ? true : false;
	var wo = window.innerWidth, 
			ho = window.innerHeight;
	if (ismobile) {
		changeLayout('mobile');
		w = wo - (wo % 2) - 6 * 2 - 4; //why -4 ???
//		h = ho - 6 * 2 - 2;
		cellWidth = Math.floor(w / 8) - 4;
		w = 8 * (cellWidth + 4) + 6 * 2;
		h = w;
	} else {
		changeLayout('default');
		cellWidth = 50;
		w = 8 * (cellWidth + 4) + 6 * 2;
		h = w;
	}
	console.log(">> start. h=" + h + "; w=" + w + "; restore= " + restore);
	var div = $('table');
//	var title = $('table-row-0');
//	title.insert("  wo=" + wo + "cw= " + cellWidth);
	div.setStyle({height: h + 'px'});
	div.setStyle({width: w + 'px'});

	doOnLoad(restore);
}

function changeLayout(description){
	var a = document.getElementById("link");
	if (description == "mobile") {
		a.setAttribute("href", "/game/css/game-mob.css");
	} else {
		a.setAttribute("href", "/game/css/game.css");
	}
}

function doOnLoad(restore) {
	var board = new Board($('table'));
	new Button($('table-row-2'), board);
	if (restore) {
		new Ajax.Request('/game/restoregame',{
			method: 'get',
			requestHeaders: {Accept: 'application/json'},
			onSuccess: 
				function(transport){
					var json = transport.responseText.evalJSON(true);
//		console.log("receive: " + json.white[0] + ";" + json.black[1]);
					board.clean_board();
					board.set_position(json);
			}
		});

	}
}
