import { EventfulObject } from "./EventfulObject.js";
import { ShipType } from "./ShipType.js";
import { Direction } from "./Direction.js";	
import { Pos } from "./Pos.js";

export const Section = Object.freeze({
	Start: 1,
	Setup: 2,
	Play: 3,
	Finish: 4
});

export class DOMInterface extends EventfulObject {

	#ui = {
		start: {
			section: document.getElementById("page-start"),
		},
		setup: {
			section: document.getElementById("page-setup"),
			ships: [],
		},
		play: {
			section: document.getElementById("page-play"),
		},
		finish: {
			section: document.getElementById("page-finished"),
		},
	};

	#curSection = Section.Start;
	#curTeam = 1;
	#curDragData = null;

	constructor() {
		super();
		// #region UI References
		this.#ui.start.title = this.#ui.start.section.querySelector(".page-title");
		this.#ui.start.buttonPVP = document.getElementById("button-vs-player");
		this.#ui.start.buttonPVE = document.getElementById("button-vs-bot");

		this.#ui.setup.title = this.#ui.setup.section.querySelector(".page-title");
		this.#ui.setup.rotateText = this.#ui.setup.section.querySelector(".normal-text");
		this.#ui.setup.rotateIcon = document.getElementById("setup-rotate-icon");
		this.#ui.setup.grid = document.getElementById("setup-grid");
		this.#ui.setup.gridCells = new Array(10).fill().map(() => new Array(10).fill(null));
		this.#ui.setup.shipContainer = document.getElementById("setup-ship-container");
		this.#ui.setup.shipCarrier = document.getElementById("carrier");
		this.#ui.setup.confirmButton = document.getElementById("setup-confirm-button");

		this.#ui.play.title = this.#ui.play.section.querySelector(".page-title");
		this.#ui.play.gridTop = document.getElementById("play-topgrid");
		this.#ui.play.missCount = document.getElementById("miss-count");
		this.#ui.play.hitCount = document.getElementById("hit-count");
		this.#ui.play.gridBot = document.getElementById("play-botgrid");

		this.#ui.finish.title = this.#ui.finish.section.querySelector(".page-title");
		this.#ui.finish.continueButton = document.getElementById("finished-button");
		// #endregion

		this.#fillSetupGrid(this.#ui.setup.grid, (e) => this.#handleSetupCellDrop(e));
		this.#fillPlayGrid(this.#ui.play.gridTop, (e) => this.#handlePlayCellClick(e));
		this.#fillPlayGrid(this.#ui.play.gridBot, null);
		
		this.#fillSetupContainer();
	}

	addShip(shipType, startRow, startCol, faceDir) {
		console.log("addship");
		let texture = shipType.texture;
		let size = shipType.size;
		if(faceDir === Direction.Up) {
			let endRow = startRow + (size - 1);
			for(let row = startRow; row <= endRow; row++){
				let cell = this.#ui.setup.gridCells[row][startCol];
				cell.style.setProperty('--ship-texture', `url(${texture})`);

				let tileClassNum = (row - startRow) + 1;
				console.log("tile class#: " + tileClassNum);
				let tileClassName = `tile${tileClassNum}`;
				let rotateClassName = `tileRotation${faceDir}`;
				cell.classList.add(tileClassName);
				cell.classList.add(rotateClassName);
			}
		}
	}

	#fillSetupContainer() {
		let container = this.#ui.setup.shipContainer;
		for(let shipType of ShipType.AsArray) {
			let newImg = document.createElement("div");
			newImg.draggable = true;
			newImg.style.backgroundImage = `url(${shipType.texture})`;
			newImg.style.width = `32px`;
			newImg.style.height = `${32 * shipType.size}px`;
			newImg.dataset.shipType = shipType.refname;

			newImg.addEventListener("dragstart", (e) => this.#handleShipDragStart(e));
			container.appendChild(newImg);
			this.#ui.setup.ships.push(newImg);
		}
	}

	#handleShipDragStart(e) {
		this.#curDragData = {
			pos: null,
			shipType: ShipType.getTypeByRefName(e.target.dataset.shipType),
			faceDir: Direction.Up
		}
	}

	#handleSetupCellDrop(e) {
		e.preventDefault();
		let shipType = this.#curDragData.shipType;
		let faceDirection = this.#curDragData.faceDir;
		let cell = e.target;
		let posArr = cell.dataset.pos.split(",");
		this.emit("ShipPlaced", { 
			shipType,
			faceDirection,
			row: Number.parseInt(posArr[0]),
			col: Number.parseInt(posArr[1]),
			team: this.#curTeam
		});

		this.#curDragData = null;
	}

	setScreenToStart() {

	}

	setScreenToSetup(forTeam) {
		// show setup container
		// hide bottom grid
	}

	setScreenToPlay(forTeam) {
		// update text elements for team
		// hide setup container
		// show bottom grid
	}

	setScreenToFinish(forTeam) {

	}

	#fillSetupGrid(container, dropHandler) {
		let docFrag = document.createDocumentFragment();

		for(let i = 0; i < 10; i++) {
			for(let j = 0; j < 10; j++) {
				let newImg = document.createElement("div");
				newImg.className = "grid-cell";
				newImg.dataset.pos = `${i},${j}`;
				this.#ui.setup.gridCells[i][j] = newImg;

				// Prevent "dragover" event so "drop" can fire.
				newImg.addEventListener("dragover", (e) => {e.preventDefault();})

				// "drop" when you drag and drop it over this element.
				newImg.addEventListener("drop", (e) => dropHandler(e));
				docFrag.appendChild(newImg);
			}
		}

		container.appendChild(docFrag);
	}

	#fillPlayGrid(container, hookClick) {

		let docFrag = document.createDocumentFragment();

		for(let i = 0; i < 10; i++) {
			for(let j = 0; j < 10; j++) {
				let newImg = document.createElement("div");
				newImg.className = "grid-cell";
				newImg.dataset.pos = `${i},${j}`;
				if(hookClick) {
					newImg.addEventListener("click", (e) => hookClick(e));
				}
				docFrag.appendChild(newImg);
			}
		}

		container.appendChild(docFrag);
	}

	#handlePlayCellClick(e) {
		let posStr = e.target.dataset.pos;
		let coords = posStr.split(",");
		let row = Number.parseInt(coords[0], 10);
		let col = Number.parseInt(coords[1], 10);
		this.emit("PlayCellClick", { row, col });
	}
};