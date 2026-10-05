import { Direction } from "./Direction.js";
import { Pos } from "./Pos.js";
import { Range } from "./Range.js";

class Ship {
	#pos;
	#faceDirection;
	#size;
	#range = new Range(-1, -1);

	#numHits = 0;
	#name;

	constructor(posX, posY, faceDirection, size, name) {
		this.#pos = new Pos(posX, posY);
		this.#faceDirection = faceDirection;
		this.#size = size;
		this.#name = name;
		this.#updateRange();
	}

	get pos() {
		return new Pos(this.#pos.x, this.#pos.y);
	}

	getRange() {
		return this.#range;
	}

	hit() {
		this.#numHits++;
	}

	isSunk() {
		return this.#numHits >= this.#size;
	}

	getName() {
		return this.#name;
	}

	get direction() {
		return this.#faceDirection;
	}

	#updateRange() {
		if(this.#faceDirection == Direction.Left) {
			this.#range.set(this.#pos.x, this.#pos.x + this.#size - 1);
		}
		else if(this.#faceDirection === Direction.Up) {
			this.#range.set(this.#pos.y, this.#pos.y + this.#size - 1);
		}
		else if(this.#faceDirection === Direction.Right) {
			this.#range.set(this.#pos.x - this.#size - 1, this.#pos.x);
		}
		else if(this.#faceDirection === Direction.Down) {
			this.#range.set(this.#pos.y - this.#size - 1, this.#pos.y);
		}
	}
}

export { Ship };