import { Direction } from "./Direction.js";
import { Ship } from "./Ship.js";
import { Range } from "./Range.js";

class Gameboard {

	#player1Board = new Array(10).fill().map(() => new Array(10).fill().map(() => { return {ship: null, hit: false}; }));
	#player1TotalShips = 0;
	#player1ShipsRemaining = 0;
	#player1MissCount = 0;

	#player2Board = new Array(10).fill().map(() => new Array(10).fill().map(() => { return {ship: null, hit: false}; }));
	#player2TotalShips = 0;
	#player2ShipsRemaining = 0;
	#player2MissCount = 0;

	getBoardTile(team, row, col) {
		let board = ( team === 1 ? this.#player1Board : this.#player2Board);
		let tile = board[col][row];
		return { ship: tile.ship, hit: tile.hit };
	}

	addShip(team, shipType, posX, posY, faceDirection) {
		if(!this.#isShipPlacementValid(team, shipType, posX, posY, faceDirection)) {
			return false;
		}

		let newShip = new Ship(shipType, posX, posY, faceDirection);
		let board = (team === 1 ? this.#player1Board : this.#player2Board);
		let range = newShip.getRange();
		if(newShip.direction === Direction.Left || newShip.direction === Direction.Right) {
			for(let col = range.start; col <= range.end; col++) {
				board[col][posY].ship = newShip;
			}
		}
		else if(newShip.direction === Direction.Up || newShip.direction === Direction.Down) {
			for(let row = range.start; row <= range.end; row++) {
				board[posX][row].ship = newShip;
			}
		}

		if(team === 1) {
			this.#player1TotalShips++;
			this.#player1ShipsRemaining++;
		}
		else {
			this.#player2TotalShips++;
			this.#player2ShipsRemaining++;
		}

		return true;
	}

	#isShipPlacementValid(team, shipType, posX, posY, faceDirection) {
		if(team !== 1 && team !== 2) { return false; }
		let board = (team == 1 ? this.#player1Board : this.#player2Board);
		let tempShip = new Ship(shipType, posX, posY, faceDirection);
		let range = tempShip.getRange();

		if(!range.isValid(0, 9)) {
			return false;
		}

		if(tempShip.direction === Direction.Left || tempShip.direction === Direction.Right) {
			for(let col = range.start; col <= range.end; col++) {
				 if(board[col][posY].ship) {
					return false;
				 }
			}
		}
		else if(tempShip.direction === Direction.Up || tempShip.direction === Direction.Down) {
			for(let row = range.start; row <= range.end; row++) {
				 if(board[posX][row].ship) {
					return false;
				 }
			}
		}

		return true;
	}

	getTotalShips() {
		return this.#player1TotalShips + this.#player2TotalShips;
	}

	get p1MissCount() {
		return this.#player1MissCount;
	}

	get p2MissCount() {
		return this.#player2MissCount;
	}

	get p1ShipsRemaining() {
		return this.#player1ShipsRemaining;
	}

	get p2ShipsRemaining() {
		return this.#player2ShipsRemaining;
	}

	receiveAttack(attackX, attackY) {

	}
}

export { Gameboard };