/**
 * 
 */
class GamePosition {
	constructor() {
		this.cellStates = new Array();
		this.clearPosition();
	}
	
	clearPosition() {
		for (var i = 0; i < DIMENSION; i++) {
			this.cellStates[i] = new Array();
			for (var j = 0; j < DIMENSION; j++) {
				this.cellStates[i][j] = 
					{figure:EMPTY, fgrId:undefined, active:false, possible: false, traceable: false};
			}
		}
	}
	
	setPosition(json) {
		this.clearPosition();
		
		for (let i = 0; i < 9; i++) {
			let x = json.white[i][0];
			let y = json.white[i][1];
			this.cellStates[x][y].figure = WHITE;
			this.cellStates[x][y].fgrId = 'fgr.w.' + i;
			x = json.black[i][0];
			y = json.black[i][1];
			this.cellStates[x][y].figure = BLACK;
			this.cellStates[x][y].fgrId = 'fgr.b.' + i;
		}
	}
	
	isEmpty(location) {
		return this.cellStates[location.i][location.j].figure == EMPTY;
	}

	getState(location) {
		return this.cellStates[location.i][location.j];
	}
	
	setState(location, state) {
		this.cellStates[location.i][location.j] = state;
	}
	
	getFigColor(location) {
		return this.cellStates[location.i][location.j].figure;
	}

	setFigColor(location, color) {
		this.cellStates[location.i][location.j].figure = color;
	}

	applyMove(move) {
		let color = this.getFigColor(move.from);
		let fgrId = this.getState(move.from).fgrId;
		var pssbl, trsbl;
		switch(color) {
			case WHITE:
				pssbl = true;
				trsbl = false;
			case BLACK:
				pssbl = false;
				trsbl = true;
		}
		this.setState(move.from, {figure:EMPTY, fgrId:undefined, active:false, possible: pssbl, traceable:trsbl});
		this.setState(move.to, {figure:color, fgrId:fgrId, active:false, possible: pssbl, traceable:trsbl});
	}
	
	generatePossibleDestinationsForLocation(startLocation, finishLocation) {
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
	}

	generateJumpMovesForLocationAndDirection(possibleDestinations, start, finish, dir, level) {
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
	}

	findStepsForMove(move) {
//		console.log('>> findStepsForMove');
		var set;
		try {
			set = this.generatePossibleDestinationsForLocation(move.from, move.to);
		} catch(e) {
			console.log("catch: " + e);
		}
		var stepsPath = new Array();
//		console.log('possibleSteps:');
//		set.forEach(e => {console.dir(JSON.stringify(e));});
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
//		console.log('Steps path to move:');
//		stepsPath.forEach(e => {console.dir(JSON.stringify(e));});
		return stepsPath;
	}
}

class Location {
	constructor(i, j) {
		this.i = i;
		this.j = j;
		this.level = 0;
		this.parent = undefined;
	}
	
	translate(deltaI, deltaJ) {
		return new Location(this.i + deltaI, this.j + deltaJ);
	}

	translateDir(dir) {
		return new Location(this.i + dir.i, this.j + dir.j);
	}
	
	isOutside() {
		return this.i < 0 || this.j < 0 || this.i >= DIMENSION || this.j >= DIMENSION;
	}
	
	equals(other) {
		return other && (this.i == other.i) && (this.j == other.j);
	}
}

class Move {
	constructor(startLocation, finishLocation) {
		this.from = startLocation;
		this.to = finishLocation;
	}
	
}

class Direction {
	constructor(i, j) {
		this.i = i;
		this.j = j;
	}
	
	double() {
		return new Direction(2 * this.i, 2 * this.j);
	}

	isOpposite(otherDir) {
		return (this.i == (-otherDir.i)) && (this.j == (-otherDir.j));
	}
}

const EMPTY = -1;
const WHITE = 0;
const BLACK = 1;

const DIMENSION = 8;
const UP = new Direction(0, 1);
const RIGHT = new Direction(1, 0);
const DOWN = new Direction(0, -1);
const LEFT = new Direction(-1, 0);
const DIRs = new Array(UP, RIGHT, DOWN, LEFT);