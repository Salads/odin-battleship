
class Range {
	#start;
	#end;

	constructor(start, end) {
		this.set(start, end);
	}

	get start() {
		return this.#start;
	}

	set start(newStart) {
		this.#assertType(newStart, "start");

		if(newStart > this.#end) {
			let temp = this.#end;
			this.#end = newStart;
			newStart = temp;
		}
		
		this.#start = newStart;
	}

	get end() {
		return this.#end;
	}

	set end(newEnd) {
		this.#assertType(newEnd, "end");

		if(this.#start > newEnd) {
			let temp = this.#start;
			this.#start = newEnd;
			newEnd = temp;
		}
		
		this.#end = newEnd;
	}

	set(start, end) {
		this.#assertType(start, "start");
		this.#assertType(end, "end");

		if(start > end) {
			let temp = start;
			start = end;
			end = temp;
		}
		
		this.#start = start;
		this.#end = end;
	}

	isValid(min, max) {
		return this.start >= min && this.end >= min && this.start <= max && this.end <= max;
	}

	#assertType(value, varName) {
		if(!Number.isInteger(value)) {
			throw new Error(`'${varName}' must be an integer!`);
		}
	}
}

export { Range };