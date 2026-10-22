import { expect, jest } from "@jest/globals";
import { ShipType } from "../scripts/ShipType.js";

// #region Section enum
// Values are the ID of the HTML sections.
export const Section = {
	Start: "page-start",
	Setup: "page-setup",
	Play : "page-play", 
	Finish: "page-finished",
	Hide: "page-hide"
};

Section.AsArray = Object.freeze([
	Section.Start, 
	Section.Setup, 
	Section.Play, 
	Section.Finish, 
	Section.Hide
]);

Object.freeze(Section);
// #endregion

// #region Section DOM Active Helpers
export function getSection(sectionType) {
	const id = sectionType;
	return document.getElementById(id);
}

function getSectionActive(sectionType) {
	return getSection(sectionType).style.display === "flex";
}

export function getSectionUniquelyActive(sectionType) {
	for(const sectionID of Section.AsArray) {
		let active = getSectionActive(sectionID);
		if(sectionID !== sectionType && active) {
			return false;
		}
		else if(sectionID === sectionType && !active) {
			return false;
		}
	}

	return true;
}
// #endregion

// #region StartSection Helpers

export function startSection_clickPVPButton() {
	const button = document.getElementById("button-vs-player");
	button.click();
}

export function startSection_clickPVEButton() {
	const button = document.getElementById("button-vs-bot");
	button.click();
}

// #endregion

// #region SetupSection Helpers

export function setupSection_getGridElement(row, col) {
	const section = getSection(Section.Setup);
	const setupCells = section.querySelectorAll(".grid-cell");
	const idx = (row * 10) + col;
	return setupCells[idx];
}

export function setupSection_getDraggableShip(shipType) {
	const container = document.getElementById("setup-ship-container");
	const ships = container.children;

	for(const ship of ships) {
		if(ship.dataset.shipType === shipType.refname) {
			return ship;
		}
	}

	return undefined;
}

export function setupSection_dropShip(shipType, row, col) {
	const ship = setupSection_getDraggableShip(shipType);

	const dataTransferMock = {
		setDragImage: () => {},
		getData: () => "",
		setData: () => {},
		clearData: () => {},
		dropEffect: "move",
		effectAllowed: "all",
		files: [],
		items: [],
		types: [],
	};

	const dragStartEventMock = new Event("dragstart", {bubbles: true, cancelable: true});
	dragStartEventMock.dataTransfer = dataTransferMock;
	ship.dispatchEvent(dragStartEventMock);

	const cell = setupSection_getGridElement(row, col);
	const dropEventMock = new Event("drop", {bubbles: true, cancelable: true});
	dropEventMock.dataTransfer = dataTransferMock;
	cell.dispatchEvent(dropEventMock);
}

export function setupSection_getTitleText() {
	const section = document.getElementById("page-setup");
	return section.querySelector(".page-title").textContent;
}

// #endregion

// #region PlaySection Helpers

export function playSection_getPlayCell(row, col) {
	const playGrid = document.getElementById("play-topgrid");
	const playCells = playGrid.querySelectorAll(".grid-cell");
	const idx = (row * 10) + col;
	return playCells[idx];
}

export function playSection_getStatusCell(row, col) {
	const statusGrid = document.getElementById("play-botgrid");
	const setupCells = statusGrid.querySelectorAll(".grid-cell");
	const idx = (row * 10) + col;
	return setupCells[idx];
}

export function playSection_clickPlayCell(row, col) {
	const playCell = playSection_getPlayCell(row, col);
	playCell.click();
}

export function playSection_getTitleText() {
	const section = document.getElementById("page-play");
	return section.querySelector(".page-title").textContent;
}

export function playSection_getHitCountText() {
	return document.getElementById("hit-count").textContent;
}

export function playSection_getMissCountText() {
	return document.getElementById("miss-count").textContent;
}

// #endregion

// #region FinishSection Helpers

export function finishSection_clickContinue() {
	const button = document.getElementById("finished-button");
	button.click();
}

export function finishSection_getTitleText() {
	const section = document.getElementById("page-finished");
	return section.querySelector(".page-title").textContent;
}

// #endregion

// #region HideSection Helpers 

export function hideSection_clickContinue() {
	const button = document.getElementById("hide-continue");
	button.click();
}

// #endregion

// NOTE(Salads): Only Up direction, for now?
export function getShipPositions(shipType, row, col) {
	let result = [];
	let endRow = row + shipType.size;
	for(let i = row; i < endRow; i++) {
		result.push([i, col]);
	}

	return result;
}