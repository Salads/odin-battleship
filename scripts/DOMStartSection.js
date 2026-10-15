import { EventfulObject } from "./EventfulObject.js";

class DOMStartSection extends EventfulObject {

	#ui = {
		section: document.getElementById("page-start"),
		buttonPVP : document.getElementById("button-vs-player"),
		buttonPVE : document.getElementById("button-vs-bot"),
	};

	constructor() {
		super();
		this.#ui.buttonPVP.addEventListener("click", (e) => this.#onPvPButtonClick(e));
		this.#ui.buttonPVE.addEventListener("click", (e) => this.#onPvEButtonClick(e));
	}

	show() {
		this.#ui.section.style.display = "block";
	}

	hide() {
		this.#ui.section.style.display = "none";
	}

	#onPvPButtonClick(e) {
		this.emit("StartPvP");
	}

	#onPvEButtonClick(e) {
		this.emit("StartPvE");
	}

};

export { DOMStartSection };