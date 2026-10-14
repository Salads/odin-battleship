import { Direction } from "./Direction.js";
import { Pos } from "./Pos.js";
import { Range } from "./Range.js";
import { ShipType } from "./ShipType.js";

class Ship {
	#type;
	#pos;
	#faceDirection;
	#size;
	#range = new Range(-1, -1);

	#numHits = 0;
	#name;

	constructor(shipType, row, col, faceDirection) {
		this.#type = shipType;
		this.#pos = new Pos(row, col);
		this.#faceDirection = faceDirection;
		this.#size = shipType.size;
		this.#name = shipType.name;
		this.#updateRange();
	}

	getRange() {
		return new Range(this.#range.start, this.#range.end);
	}

	hit() {
		this.#numHits++;
	}

	isSunk() {
		return this.#numHits >= this.#size;
	}

	get type() {
		return this.#type;
	}

	get name() {
		return this.#name;
	}

	get direction() {
		return this.#faceDirection;
	}

	get row() {
		return this.#pos.row;
	}

	get col() {
		return this.#pos.col;
	}

	#updateRange() {
		if(this.#faceDirection === Direction.Left) {
			this.#range.set(this.#pos.col, this.#pos.col + this.#size - 1);
		}
		else if(this.#faceDirection === Direction.Up) {
			this.#range.set(this.#pos.row, this.#pos.row + this.#size - 1);
		}
		else if(this.#faceDirection === Direction.Right) {
			this.#range.set(this.#pos.col - this.#size + 1, this.#pos.col);
		}
		else if(this.#faceDirection === Direction.Down) {
			this.#range.set(this.#pos.row - this.#size + 1, this.#pos.row);
		}
	}
}

export { Ship };