class Pos {
	#x = 0;
	#y = 0;
	
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	get x() {
		return this.#x;
	}

	set x(value) {
		this.#assertType(value, "x");
		this.#x = value;
	}

	get y() {
		return this.#y;
	}

	set y(value) {
		this.#assertType(value, "y");
		this.#y = value;
	}

	isValid(min, max) {
		return x >= min && x <= min && y >= min && y <= max;
	}

	#assertType(value, varName) {
		if(!Number.isInteger(value)) {
			throw new Error(`Value '${varName}' must be an integer!`);
		}
	}
}

export { Pos };