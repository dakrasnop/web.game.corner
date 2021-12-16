'use strict';

var cellWidth = 10;

function start(restore, index) {
	let ismobile = (navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i)) ? true : false;
	let wo = window.innerWidth, 
			ho = window.innerHeight;
	let w, h;
	if (ismobile) {
		changeLayout('mobile', index);
		w = wo - (wo % 2) - 6 * 2 - 4; //why -4 ???
//		h = ho - 6 * 2 - 2;
		cellWidth = Math.floor(w / 8) - 4;
		w = 8 * (cellWidth + 4) + 6 * 2;
		h = w;
	} else {
		changeLayout('default', index);
		cellWidth = 50;
		w = 8 * (cellWidth + 4) + 6 * 2;
		h = w;
	}
	console.log(">> start. cellWidth=" + cellWidth + "; h=" + h + "; w=" + w + "; restore= " + restore + "; index= " + index);
	ReactDOM.render(e(Game,{restore:restore, size:h}), document.getElementById('table-row-1'));
}

function changeLayout(description, index){
	if (index) {
		index = index % 2;
	} else {
		index = 0;
	}
	var a = document.getElementById("link");
	if (description == "mobile") {
		a.setAttribute("href", "/game/css/game-mob-" + index + ".css");
	} else {
		a.setAttribute("href", "/game/css/game-" + index + ".css");
	}
}
/*
function doOnLoad(restore) {
//	new Button($('table-row-2'), board);
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
*/