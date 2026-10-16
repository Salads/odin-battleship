import { EventfulObject } from "./EventfulObject.js";

class DOMFinishSection extends EventfulObject {
	#ui = {
		section: document.getElementById("page-finished"),
		continueButton : document.getElementById("finished-button"),
	};

	constructor() {
		super();
		this.#ui.title = this.#ui.section.querySelector(".page-title");
		this.#ui.continueButton.addEventListener("click", (e) => this.#onFinishContinueClick(e));
	}

	show(forTeam) {
		this.#ui.title.textContent = `Player ${forTeam} Wins!`;
		this.#ui.section.style.display = "flex";
	}

	hide() {
		this.#ui.section.style.display = "none";
	}

	#onFinishContinueClick(e) {
		this.emit("FinishContinue");
	}
};

export { DOMFinishSection };