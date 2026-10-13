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
		this.#ui.play.gridTopCells = new Array(10).fill().map(() => new Array(10).fill(null));
		this.#ui.play.missCount = document.getElementById("miss-count");
		this.#ui.play.hitCount = document.getElementById("hit-count");
		this.#ui.play.gridBot = document.getElementById("play-botgrid");
		this.#ui.play.gridBotCells = new Array(10).fill().map(() => new Array(10).fill(null));

		this.#ui.finish.title = this.#ui.finish.section.querySelector(".page-title");
		this.#ui.finish.continueButton = document.getElementById("finished-button");
		// #endregion

		let body = document.querySelector("body");
		body.appendChild(this.#drag.dragImg);
		this.#drag.dragImg.className = "drag-img";

		this.#createSetupGrid(this.#ui.setup.grid, (e) => this.#handleSetupCellDrop(e));
		this.#createPlayScreenGrid(this.#ui.play.gridTop, this.#ui.play.gridTopCells, (e) => this.#handlePlayCellClick(e));
		this.#createPlayScreenGrid(this.#ui.play.gridBot, this.#ui.play.gridBotCells, null);
		
		this.#createSetupShips();

		document.addEventListener("drag", (e) => this.#handleOnDrag(e));
		document.addEventListener("dragend", (e) => this.#handleDragEnd(e));
		this.#ui.start.buttonPVP.addEventListener("click", (e) => this.#onPvPButtonClick(e));
		this.#ui.start.buttonPVE.addEventListener("click", (e) => this.#onPvEButtonClick(e));
		this.#ui.finish.continueButton.addEventListener("click", (e) => this.#onFinishContinueClick(e));
	}

	// #region Common Private Functions

	#addShip(gridCells, shipType, startRow, startCol, faceDir) {
		let texture = shipType.texture;
		let size = shipType.size;
		if(faceDir === Direction.Up) {
			let endRow = startRow + (size - 1);
			for(let row = startRow; row <= endRow; row++){
				let cell = gridCells[row][startCol];
				cell.style.setProperty('--ship-texture', `url(${texture})`);

				let tileClassNum = row - startRow + 1;
				let tileClassName = `tile${tileClassNum}`;
				let rotateClassName = `tileRotation${faceDir}`;
				cell.classList.add(tileClassName);
				cell.classList.add(rotateClassName);
			}
		}
		else if(faceDir === Direction.Right) {
			let endCol = startCol - (size - 1);
			for(let col = startCol; col >= endCol; col--){
				let cell = gridCells[startRow][col];
				cell.style.setProperty('--ship-texture', `url(${texture})`);

				let tileClassNum = startCol - col + 1;
				let tileClassName = `tile${tileClassNum}`;
				let rotateClassName = `tileRotation${faceDir}`;
				cell.classList.add(tileClassName);
				cell.classList.add(rotateClassName);
			}
		}
		else if(faceDir === Direction.Down) {
			let endRow = startRow - (size - 1);
			for(let row = startRow; row >= endRow; row--){
				let cell = gridCells[row][startCol];
				cell.style.setProperty('--ship-texture', `url(${texture})`);

				let tileClassNum = startRow - row + 1;
				let tileClassName = `tile${tileClassNum}`;
				let rotateClassName = `tileRotation${faceDir}`;
				cell.classList.add(tileClassName);
				cell.classList.add(rotateClassName);
			}
		}
		else if(faceDir === Direction.Left) {
			let endCol = startCol + (size - 1);
			for(let col = startCol; col <= endCol; col++){
				let cell = gridCells[startRow][col];
				cell.style.setProperty('--ship-texture', `url(${texture})`);

				let tileClassNum = col - startCol + 1;
				let tileClassName = `tile${tileClassNum}`;
				let rotateClassName = `tileRotation${faceDir}`;
				cell.classList.add(tileClassName);
				cell.classList.add(rotateClassName);
			}
		}
	}

	// #endregion

	// #region Start Screen

	#onPvPButtonClick(e) {
		this.emit("StartPvP");
	}

	#onPvEButtonClick(e) {
		this.emit("StartPvE");
	}

	// #endregion

	// #region Setup Screen

	addSetupShip(shipType, row, col, faceDir) {

		this.#addShip(this.#ui.setup.gridCells, shipType, row, col, faceDir);
		let setupShip = this.#ui.setup.ships.find((e) => e.dataset.shipType === shipType.refname);
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

	#createSetupShips() {
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

	#resetSetupGrid() {
		for(let row = 0; row < 10; row++) {
			for(let col = 0; col < 10; col++) {
				let cell = this.#ui.setup.gridCells[row][col];
				cell.className = "grid-cell";
				cell.style.removeProperty("--ship-texture");
			}
		}
	}

	#resetSetupShips() {
		for(let dragShip of this.#ui.setup.ships) {
			dragShip.style.display = "block";
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
		this.emit("ShipPlaced", { 
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

	// #endregion

	// #region Play Screen

	addStatusShip(shipType, row, col, faceDir) {
		this.#addShip(this.#ui.play.gridBotCells, shipType, row, col, faceDir);
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
				let cell = this.#ui.play.gridTopCells[i][j];
				cell.className = "grid-cell";
				cell.style.removeProperty("--ship-texture");
			}
		}
	}

	#resetStatusBoard() {
		for(let i = 0; i < 10; i++){
			for(let j = 0; j < 10; j++) {
				let cell = this.#ui.play.gridBotCells[i][j];
				cell.className = "grid-cell";
				cell.style.removeProperty("--ship-texture");
			}
		}
	}

	#setAttackBoard(gameboard, forTeam) {
		this.#resetAttackBoard();

		let enemyTeam = 1;
		if(forTeam === 1) { enemyTeam = 2; }

		for(let i = 0; i < 10; i++) {
			for(let j = 0; j < 10; j++) {
				let tile = gameboard.getBoardTile(enemyTeam, i, j);
				if(tile.hit) {
					this.setAttackTileHit(i, j, tile.ship);
				}
			}
		}
	}

	#setStatusBoard(gameboard, forTeam) {
		this.#resetStatusBoard();

		// Place ships
		let ships = gameboard.getShipsForTeam(forTeam);
		for(let ship of ships) {
			let row = ship.getPos().y;
			let col = ship.getPos().x;
			this.addStatusShip(ship.type, row, col, ship.direction);
		}

		// Update "hit" status of cells.
		for(let i = 0; i < 10; i++) {
			for(let j = 0; j < 10; j++) {
				let tile = gameboard.getBoardTile(forTeam, i, j);
				if(tile.hit) {
					this.setAttackTileHit(i, j, tile.ship);
				}
			}
		}
	}

	setAttackTileHit(row, col, hit) {
		let cell = this.#ui.play.gridTopCells[row][col];
		cell.className = "grid-cell";
		if(hit) {
			cell.classList.add("hit");
		}
		else {
			cell.classList.add("miss");
		}
	}

	setStatusTileHit(row, col, hit) {
		let cell = this.#ui.play.gridBotCells[row][col];
		cell.className = "grid-cell";
		if(hit) {
			cell.classList.add("hit");
		}
		else {
			cell.classList.add("miss");
		}
	}

	setPlayStats(numMisses, numHits) {
		this.#ui.play.missCount.textContent = `${numMisses} Misses`;
		this.#ui.play.hitCount.textContent = `${numHits} Hits`;
	}

	#handlePlayCellClick(e) {
		let posStr = e.target.dataset.pos;
		let coords = posStr.split(",");
		let row = Number.parseInt(coords[0], 10);
		let col = Number.parseInt(coords[1], 10);
		this.emit("PlayCellClick", { row, col, team: this.#curTeam });
	}
	
	// #endregion

	// #region Finish Screen

	#onFinishContinueClick(e) {
		this.emit("FinishContinue");
	}

	// #endregion

	// #region Screen Switchers

	setScreenToStart() {
		this.#curSection = Section.Start;
		this.#ui.start.section.style.display = "block";
		this.#ui.setup.section.style.display = "none";
		this.#ui.play.section.style.display = "none";
		this.#ui.finish.section.style.display = "none";
	}

	setScreenToSetup(forTeam) {
		this.#resetSetupGrid();
		this.#resetSetupShips();

		this.#curTeam = forTeam;
		this.#curSection = Section.Setup;
		this.#ui.setup.title.innerContent = `Player ${forTeam} Setup`;
		
		this.#ui.start.section.style.display = "none";
		this.#ui.setup.section.style.display = "block";
		this.#ui.play.section.style.display = "none";
		this.#ui.finish.section.style.display = "none";
	}

	setScreenToPlay(forTeam, missCount, hitCount, gameboard) {
		this.#curTeam = forTeam;
		this.#curSection = Section.Play;
		this.#ui.play.title.textContent = `Player ${forTeam}'s Turn!`;

		this.#setAttackBoard(gameboard, forTeam);
		this.setPlayStats(missCount, hitCount);
		this.#setStatusBoard(gameboard, forTeam);

		this.#ui.start.section.style.display = "none";
		this.#ui.setup.section.style.display = "none";
		this.#ui.play.section.style.display = "block";
		this.#ui.finish.section.style.display = "none";
	}

	setScreenToFinish(forTeam) {
		this.#curTeam = forTeam;
		this.#curSection = Section.Finish;
		this.#ui.finish.title.textContent = `Player ${forTeam} Wins!`;
		
		this.#ui.start.section.style.display = "none";
		this.#ui.setup.section.style.display = "none";
		this.#ui.play.section.style.display = "none";
		this.#ui.finish.section.style.display = "block";
	}

	// #endregion

};