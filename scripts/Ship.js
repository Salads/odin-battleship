class Ship {
	#pos;
	#size;
	#numHits = 0;

	constructor(pos, size) {
		this.#pos = pos;
		this.#size = size;
	}

	hit() {
		this.#numHits++;
	}

	isSunk() {
		return this.#numHits >= this.#size;
	}
}

export { Ship };