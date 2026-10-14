class Pos {
	#row = 0;
	#col = 0;
	
	constructor(row, col) {
		this.row = row;
		this.col = col;
	}

	get row() { return this.#row; }

	set row(value) {
		this.#assertType(value, "row");
		this.#row = value;
	}

	get col() { return this.#col; }

	set col(value) {
		this.#assertType(value, "col");
		this.#col = value;
	}

	set(row, col) {
		this.row = row;
		this.col = col;
	}

	isValid(min, max) {
		return this.row >= min && this.row <= max && this.col >= min && this.col <= max;
	}

	#assertType(value, varName) {
		if(!Number.isInteger(value)) {
			throw new Error(`Value '${varName}' must be an integer!`);
		}
	}
}

export { Pos };