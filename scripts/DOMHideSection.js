import { EventfulObject } from "./EventfulObject.js";

class DOMHideSection extends EventfulObject {

	#ui = {
		section: document.getElementById("page-hide"),
		button: document.getElementById("hide-continue"),
	};

	constructor() {
		super();
		this.#ui.title = this.#ui.section.querySelector(".page-title");
		this.#ui.button.addEventListener("click", (e) => this.#onButtonClicked(e));
	}

	show(forTeam) {
		this.#ui.title.textContent = `Pass to player ${forTeam}!`;
		this.#ui.section.style.display = "flex";
	}

	hide() {
		this.#ui.section.style.display = "none";
	}

	#onButtonClicked(e) {
		this.emit("HideContinue");
	}

};

export { DOMHideSection };