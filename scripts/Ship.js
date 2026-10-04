class Ship {
	#pos;
	#size;
	#numHits = 0;

	#name;

	constructor(pos, size, name) {
		this.#pos = pos;
		this.#size = size;
		this.#name = name;
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
}

export { Ship };