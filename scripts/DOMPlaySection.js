import { addShip } from "./DOMCommon.js";
import { EventfulObject } from "./EventfulObject.js";

class DOMPlaySection extends EventfulObject {

	#ui = {
		section: document.getElementById("page-play"),
		gridTop : document.getElementById("play-topgrid"),
		gridTopCells : new Array(10).fill().map(() => new Array(10).fill(null)),
		missCount : document.getElementById("miss-count"),
		hitCount : document.getElementById("hit-count"),
		gridBot : document.getElementById("play-botgrid"),
		gridBotCells : new Array(10).fill().map(() => new Array(10).fill(null)),
	};

	#curTeam = 0;

	constructor() {
		super();
		this.#ui.title = this.#ui.section.querySelector(".page-title");

		this.#createPlayScreenGrid(this.#ui.gridTop, this.#ui.gridTopCells, (e) => this.#handlePlayCellClick(e));
		this.#createPlayScreenGrid(this.#ui.gridBot, this.#ui.gridBotCells, null);
	}

	show(playerState, enemyState) {
		this.#setAttackBoard(enemyState);
		this.#setStatusBoard(playerState);
		this.setPlayStats(playerState.missCount, playerState.hitCount);
		this.#ui.section.style.display = "block";
	}

	hide() {
		this.#ui.section.style.display = "none";
	}

	addStatusShip(shipType, row, col, faceDir) {
		addShip(this.#ui.gridBotCells, shipType, row, col, faceDir);
	}

	#createPlayScreenGrid(container, cellsArr, clickHook) {

		let docFrag = document.createDocumentFragment();

		for(let i = 0; i < 10; i++) {
			for(let j = 0; j < 10; j++) {
				let newImg = document.createElement("div");
				newImg.className = "grid-cell";
				newImg.dataset.pos = `${i},${j}`;
				cellsArr[i][j] = newImg;

				if(clickHook) {
					newImg.addEventListener("click", (e) => clickHook(e));
				}

				docFrag.appendChild(newImg);
			}
		}

		container.appendChild(docFrag);
	}

	#resetAttackBoard() {
		for(let i = 0; i < 10; i++){
			for(let j = 0; j < 10; j++) {
				let cell = this.#ui.gridTopCells[i][j];
				cell.className = "grid-cell";
				cell.style.removeProperty("--ship-texture");
			}
		}
	}

	#resetStatusBoard() {
		for(let i = 0; i < 10; i++){
			for(let j = 0; j < 10; j++) {
				let cell = this.#ui.gridBotCells[i][j];
				cell.className = "grid-cell";
				cell.style.removeProperty("--ship-texture");
			}
		}
	}

	#setAttackBoard(enemyState) {
		this.#resetAttackBoard();

		for(let row = 0; row < 10; row++) {
			for(let col = 0; col < 10; col++) {
				let tile = enemyState.board[row][col];
				if(tile.hit) {
					this.setAttackTileHit(row, col, tile.ship);
				}
			}
		}
	}

	#setStatusBoard(playerState) {
		this.#resetStatusBoard();

		// Place ships
		for(let ship of playerState.ships) {
			let row = ship.row;
			let col = ship.col;
			this.addStatusShip(ship.type, row, col, ship.direction);
		}

		// Update "hit" status of cells.
		for(let i = 0; i < 10; i++) {
			for(let j = 0; j < 10; j++) {
				let tile = playerState.board[i][j];
				if(tile.hit) {
					this.setStatusTileHit(i, j, tile.ship);
				}
			}
		}
	}

	setAttackTileHit(row, col, hit) {
		let cell = this.#ui.gridTopCells[row][col];
		if(hit) {
			cell.classList.add("hit");
		}
		else {
			cell.classList.add("miss");
		}
	}

	setStatusTileHit(row, col, hit) {
		let cell = this.#ui.gridBotCells[row][col];
		if(hit) {
			cell.classList.add("hit");
		}
		else {
			cell.classList.add("miss");
		}
	}

	setPlayStats(numMisses, numHits) {
		this.#ui.missCount.textContent = `${numMisses} Misses`;
		this.#ui.hitCount.textContent = `${numHits} Hits`;
	}

	#handlePlayCellClick(e) {
		let posStr = e.target.dataset.pos;
		let coords = posStr.split(",");
		let row = Number.parseInt(coords[0], 10);
		let col = Number.parseInt(coords[1], 10);
		this.emit("PlayCellClick", { row, col, team: this.#curTeam });
	}

};

export { DOMPlaySection };