import { addShip } from "./DOMCommon.js";
import { EventfulObject } from "./EventfulObject.js";
import { Direction } from "./Direction.js";
import { ShipType } from "./ShipType.js";

class DOMSetupSection extends EventfulObject {

	#ui = {
		section: document.getElementById("page-setup"),
		ships: [],
		rotateIcon : document.getElementById("setup-rotate-icon"),
		grid : document.getElementById("setup-grid"),
		gridCells : new Array(10).fill().map(() => new Array(10).fill(null)),
		shipContainer : document.getElementById("setup-ship-container"),
		confirmButton : document.getElementById("setup-confirm-button"),
	};

	#curTeam = 0;
	#drag = {
		active: false,
		shipType: null,
		faceDir: Direction.Up,
		ctrlWasDown: false,
		dragImg: document.createElement("img")
	};

	#nSetupShips = 5;

	constructor() {
		super();

		this.#ui.title = this.#ui.section.querySelector(".page-title");
		this.#ui.rotateText = this.#ui.section.querySelector(".normal-text");

		let body = document.querySelector("body");
		body.appendChild(this.#drag.dragImg);
		this.#drag.dragImg.className = "drag-img";

		this.#createSetupGrid(this.#ui.grid, (e) => this.#handleSetupCellDrop(e));
		this.#createSetupShips();

		document.addEventListener("drag", (e) => this.#handleOnDrag(e));
		document.addEventListener("dragend", (e) => this.#handleDragEnd(e));
	}

	show(forTeam) {
		this.#curTeam = forTeam;
		this.#resetSetupGrid();
		this.#resetSetupShips();
		this.#ui.title.textContent = `Player ${forTeam} Setup`;
		this.#ui.section.style.display = "block";
	}

	hide() {
		this.#ui.section.style.display = "none";
	}

	addSetupShip(shipType, row, col, faceDir) {
	
		addShip(this.#ui.gridCells, shipType, row, col, faceDir);
		let setupShip = this.#ui.ships.find((e) => e.dataset.shipType === shipType.refname);
		setupShip.style.display = "none";

		this.#nSetupShips--;
		if(!this.#nSetupShips) {
			this.emit("SetupFinished", { team: this.#curTeam });
		}
	}
	
	#createSetupGrid(container, dropHandler) {
		let docFrag = document.createDocumentFragment();

		for(let i = 0; i < 10; i++) {
			for(let j = 0; j < 10; j++) {
				let newImg = document.createElement("div");
				newImg.className = "grid-cell";
				newImg.dataset.pos = `${i},${j}`;
				this.#ui.gridCells[i][j] = newImg;

				// Prevent "dragover" event so "drop" can fire.
				newImg.addEventListener("dragover", (e) => {e.preventDefault();})

				// "drop" when you drag and drop it over this element.
				newImg.addEventListener("drop", (e) => dropHandler(e));
				docFrag.appendChild(newImg);
			}
		}

		container.appendChild(docFrag);
	}
	
	#createSetupShips() {
		let container = this.#ui.shipContainer;
		for(let shipType of ShipType.AsArray) {
			let newImg = document.createElement("div");
			newImg.draggable = true;
			newImg.style.backgroundImage = `url(${shipType.texture})`;
			newImg.style.width = `32px`;
			newImg.style.height = `${32 * shipType.size}px`;
			newImg.dataset.shipType = shipType.refname;

			newImg.addEventListener("dragstart", (e) => this.#handleShipDragStart(e));
			container.appendChild(newImg);
			this.#ui.ships.push(newImg);
		}
	}
	
	#resetSetupGrid() {
		for(let row = 0; row < 10; row++) {
			for(let col = 0; col < 10; col++) {
				let cell = this.#ui.gridCells[row][col];
				cell.className = "grid-cell";
				cell.style.removeProperty("--ship-texture");
			}
		}
	}

	#resetSetupShips() {
		for(let dragShip of this.#ui.ships) {
			dragShip.style.display = "";
		}

		this.#nSetupShips = 5;
	}

	// #region Drag Event Handlers

	#handleOnDrag(e) {
		if(this.#drag.active) {

			if(!this.#drag.ctrlWasDown && e.ctrlKey) {
				this.#drag.ctrlWasDown = true;
				console.log("rotate");
				let curIdx = Direction.AsArray.findIndex((e) => e === this.#drag.faceDir);
				if(curIdx === -1) {curIdx = 0;}

				curIdx = (curIdx + 1) % Direction.AsArray.length;
				this.#drag.faceDir = Direction.AsArray[curIdx];

				switch(this.#drag.faceDir) {
					case Direction.Up:
						this.#drag.dragImg.style.transform = 'rotate(0deg)';
						break;
					case Direction.Left:
						this.#drag.dragImg.style.transform = 'rotate(270deg)';
						break;
					case Direction.Down:
						this.#drag.dragImg.style.transform = 'rotate(180deg)';
						break;
					case Direction.Right:
						this.#drag.dragImg.style.transform = 'rotate(90deg)';
						break;
				}
			}

			this.#drag.dragImg.style.left = (e.clientX - 16) + "px";
			this.#drag.dragImg.style.top = (e.clientY - 16) + "px";
		}

		if(!e.ctrlKey) {
			this.#drag.ctrlWasDown = false;
		}
	}

	#handleShipDragStart(e) {
		this.#drag.active = true;
		this.#drag.shipType = ShipType.getTypeByRefName(e.target.dataset.shipType);
		this.#drag.faceDir = Direction.Up;

		// Override drag image with fake invisible one.
		// We'll use our own and position it ourselves to support rotation.
		// (Drag API doesn't support updates past "dragstart" event)
		e.dataTransfer.setDragImage(document.createElement("img"), 0, 0);

		// Setup our custom drag image
		this.#drag.dragImg.src = this.#drag.shipType.texture;
		this.#drag.dragImg.style.width = `32px`;
		this.#drag.dragImg.style.height = `${32 * this.#drag.shipType.size}px`;
		this.#drag.dragImg.style.display = "block";
		this.#drag.dragImg.style.transform = 'rotate(0deg)';
		this.#drag.ctrlWasDown = false;
	}

	#handleSetupCellDrop(e) {
		e.preventDefault();
		let shipType = this.#drag.shipType;
		let faceDirection = this.#drag.faceDir;
		let cell = e.target;
		let posArr = cell.dataset.pos.split(",");
		this.emit("SetupShipPlaced", { 
			shipType,
			faceDirection,
			row: Number.parseInt(posArr[0]),
			col: Number.parseInt(posArr[1]),
			team: this.#curTeam
		});
	}

	#handleDragEnd(e) {
		this.#drag.active = false;
		this.#drag.dragImg.style.display = "none";
	}

	// #endregion

};

export { DOMSetupSection };