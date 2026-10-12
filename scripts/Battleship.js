import { DOMInterface } from "./DOMInterface.js";
import { Gameboard } from "./Gameboard.js";

const GameState = Object.freeze({
	NotStarted: 1,
	Started: 2,
	Finished: 3,
});

export class Battleship {
	#dom = new DOMInterface();
	#gameboard = new Gameboard();

	#turn = 1;

	constructor() {
		this.#dom.hook("ShipPlaced", (e) => this.#onShipPlaced(e));
	}

	cycleTurn() {
		if(this.#turn === 1) {
			this.#turn = 2;
		}
		else {
			this.#turn = 1;
		}
	}

	#onShipPlaced(e) {
		let success = this.#gameboard.addShip(
			e.team,
			e.shipType,
			e.col, e.row,
			e.faceDirection
		);

		// TODO(Salads): Validate drops from DOM side.
		if(!success) { throw new Error("Invalid Ship Placement"); }
		this.#dom.addShip(e.shipType, e.row, e.col, e.faceDirection);
	}

};