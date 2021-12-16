function start() {
	var ismobile = (navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i)) ? true : false;
	var w = window.innerWidth, 
			h = window.innerHeight;
	if (ismobile) {
		changeLayout('mobile');
		w = w - 4;
		h = h - 4;
	} else {
		changeLayout('default');
		w = 428;
		h = 428;
	}
	console.log(">> start. h=" + h + "; w=" + w);
	var div = $('table');
	div.setStyle({height: h + 'px'});
	div.setStyle({width: w + 'px'});

	doOnLoad();
}

function changeLayout(description){
	var a = document.getElementById("link");
	if (description == "mobile") {
		a.setAttribute("href", "game/css/game-mob.css");
	} else {
		a.setAttribute("href", "game/css/game.css");
	}
}

function doOnLoad() {
	var tbl = new Board($('table'));
	new Button($('table-row-2'), tbl);
}

