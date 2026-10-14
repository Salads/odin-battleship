import { validateShipPlacement } from "./ShipValidation.js";
import { Ship } from "./Ship.js";
import { Direction } from "./Direction.js";

class PlayerState {
	#board;
	#ships = [];
	#shipsRemaining = 0;
	#missCount = 0;
	#hitCount = 0;
	#team = 0;

	constructor(team) {
		this.#board = new Array(10)
			.fill()
			.map(() => new Array(10)
				.fill()
				.map(() => { 
					return {ship: null, hit: false}; }));
		
		this.#team = team;
	}

	// #region Properties

	get board() {
		return this.#board;
	}

	get ships() {
		return this.#ships;
	}

	get totalShips() {return this.#ships.length;}

	get shipsRemaining() {return this.#shipsRemaining;}

	get missCount() {return this.#missCount;}
	miss() {this.#missCount++;}

	get hitCount() {return this.#hitCount;}
	hit() {this.#hitCount++;}
	
	get team() {
		return this.#team;
	}

	// #endregion

	receiveAttack(row, col) {
		let tile = this.getTile(row, col);
		if(tile.hit) {
			throw new Error("Tile hit twice!");
		}

		tile.hit = true;
		if(tile.ship) {
			tile.ship.hit();
			
			if(tile.ship.isSunk()) {
				this.#shipsRemaining--;
			}
		}

		return Boolean(tile.ship);
	}

	getTile(row, col) {
		return this.#board[row][col];
	}

	addShip(shipType, startRow, startCol, faceDirection) {
		
		if(this.ships.find((elem) => elem.type.refname === shipType.refname)){
			throw new Error(`Tried to add duplicate of Ship '${shipType.displayName}'!`);
		}
		
		if(!validateShipPlacement(this.#board, shipType, startRow, startCol, faceDirection)) {
			return false;
		}

		let newShip = new Ship(shipType, startRow, startCol, faceDirection);
		this.#ships.push(newShip);

		// Set relevant board tiles
		let range = newShip.getRange();
		if(newShip.direction === Direction.Left || newShip.direction === Direction.Right) {
			for(let col = range.start; col <= range.end; col++) {
				this.#board[startRow][col].ship = newShip;
			}
		}
		else if(newShip.direction === Direction.Up || newShip.direction === Direction.Down) {
			for(let row = range.start; row <= range.end; row++) {
				this.#board[row][startCol].ship = newShip;
			}
		}

		this.#shipsRemaining++;
		return true;
	}

	reset() {
		for(let row = 0; row < 10; row++){
			for(let col = 0; col < 10; col++) {
				this.#board[row][col].ship = null;
				this.#board[row][col].hit = false;
			}
		}

		this.#ships = [];
		this.#shipsRemaining = 0;
		this.#missCount = 0;
		this.#hitCount = 0;
	}

	printBoard() {
		for(let row = 0; row < 10; row++){
			let line = "";
			for(let col = 0; col < 10; col++) {
				let tile = this.getTile(row, col);
				if(tile.ship) {
					line += tile.ship.type.displayName[0];
				}
				else {
					line += "~";
				}
			}
			console.log(line);
		}
	}
};

export { PlayerState };