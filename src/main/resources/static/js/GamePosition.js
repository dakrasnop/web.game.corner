/**
 * 
 */
var GamePosition = Class.create({
	initialize: function() {
		this.cellStates = new Array();
	},
	
	init: function() {
		for (var i = 0; i < DIMENSION; i++) {
			this.cellStates[i] = new Array();
			for (var j = 0; j < DIMENSION; j++) {
				this.cellStates[i][j] = EMPTY;
			}
		}

		for (var i = 0; i < 3; i++) {
			for (var j = 0; j < 3; j++) {
				this.cellStates[i][j + DIMENSION - 3] = WHITE;
				this.cellStates[i + DIMENSION - 3][j] = BLACK;
			}
		}
//		console.table(this.cellStates);
	},
	
	setPosition: function(json) {
		for (var i = 0; i < DIMENSION; i++) {
			this.cellStates[i] = new Array();
			for (var j = 0; j < DIMENSION; j++) {
				this.cellStates[i][j] = EMPTY;
			}
		}
		
		for (var i = 0; i < 9; i++) {
			var x = json.white[i][0];
			var y = json.white[i][1];
			this.cellStates[x][y] = WHITE;
			x = json.black[i][0];
			y = json.black[i][1];
			this.cellStates[x][y] = BLACK;
		}
	},
	
	isEmpty: function(location) {
		return this.cellStates[location.i][location.j] == EMPTY;
	},

	getFigColor: function(location) {
		return this.cellStates[location.i][location.j];
	},

	setFigColor: function(location, color) {
		this.cellStates[location.i][location.j] = color;
	},

	
	applyMove: function(move) {
		var color = this.getFigColor(move.from);
		this.setFigColor(move.from, EMPTY);
		this.setFigColor(move.to, color);
	},
	
	generatePossibleDestinationsForLocation: function(startLocation, finishLocation) {
		var possibleDestinations = new Set();
//		var that = this;
		DIRs.forEach(to => {
			var goTo = startLocation.translateDir(to);
			if (!goTo.isOutside()) {
				if (this.isEmpty(goTo)) {
				  goTo.level = 1;
					goTo.parent = startLocation;
					possibleDestinations.add(goTo)
					if (goTo.equals(finishLocation)) {     // check if finish in a set of allowed locations.
						return possibleDestinations; // TODO delete other locations the same level.
					}
				} else {
					this.generateJumpMovesForLocationAndDirection(possibleDestinations, startLocation, finishLocation, to, 1);
				}
			}
		})
		return possibleDestinations;
	},

	generateJumpMovesForLocationAndDirection: function(possibleDestinations, start, finish, dir, level) {
		var jumpTo = start.translateDir(dir.double());
		
		if (jumpTo.isOutside()) return; // over board !!!

		for (let loc of possibleDestinations) {
			if (loc.equals(jumpTo)) return;
		}
		if (!this.isEmpty(jumpTo)) return; // cell behind next cell is not empty

		if (this.isEmpty(start.translateDir(dir))) return; // next cell is empty

		jumpTo.level = level;
		jumpTo.parent = start;
		possibleDestinations.add(jumpTo);
		if (jumpTo.equals(finish)) return; // TODO delete other locations the same level.

		DIRs.forEach(to => {
			if (!to.isOpposite(dir)) { // testing: is the move back?
				this.generateJumpMovesForLocationAndDirection(possibleDestinations, jumpTo, finish, to, level + 1);
			}
		})
	},

	findStepsForMove: function(move) {
		console.log('>> findStepsForMove');
		var set;
		try {
			set = this.generatePossibleDestinationsForLocation(move.from, move.to);
		} catch(e) {
			console.log("catch: " + e);
		}
		var stepsPath = new Array();
		console.log('possibleSteps:');
		set.forEach(e => {console.dir(JSON.stringify(e));});
//		console.log('--------------');

		var currentLoc;
		for (let loc of set) {
			if (loc.equals(move.to)) {
				currentLoc = loc;
				break;
			}
		}

		var i = 0;
		while (i++ < 50) {
			if (currentLoc.parent) {
				stepsPath.push(currentLoc);
				currentLoc = currentLoc.parent;
			} else {
				break;
			}
		}
		console.log('Steps path to move:');
		stepsPath.forEach(e => {console.dir(JSON.stringify(e));});
		return stepsPath;
	}

})

var Location = Class.create({
	initialize: function(i, j) {
		this.i = i;
		this.j = j;
		this.level = 0;
		this.parent = undefined;
	},
	
	translate: function(deltaI, deltaJ) {
		return new Location(this.i + deltaI, this.j + deltaJ);
	},

	translateDir: function(dir) {
		return new Location(this.i + dir.i, this.j + dir.j);
	},
	
	isOutside: function() {
		return this.i < 0 || this.j < 0 || this.i >= DIMENSION || this.j >= DIMENSION;
	},
	
	equals: function(other) {
		return other && (this.i == other.i) && (this.j == other.j);
	}

})

var Move = Class.create({
	initialize: function(startLocation, finishLocation) {
		this.from = startLocation;
		this.to = finishLocation;
	}
	
})

var Direction = Class.create({
	initialize: function(i, j) {
		this.i = i;
		this.j = j;
	},
	
	double: function() {
		return new Direction(2 * this.i, 2 * this.j);
	},

	isOpposite: function(otherDir) {
		return (this.i == (-otherDir.i)) && (this.j == (-otherDir.j));
	}
	
})

const EMPTY = -1;
const WHITE = 0;
const BLACK = 1;

const DIMENSION = 8;
const UP = new Direction(0, 1);
const RIGHT = new Direction(1, 0);
const DOWN = new Direction(0, -1);
const LEFT = new Direction(-1, 0);
const DIRs = new Array(UP, RIGHT, DOWN, LEFT);