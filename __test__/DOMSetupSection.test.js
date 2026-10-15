import { test, expect, jest, beforeEach } from "@jest/globals";
import { readFileSync } from "node:fs";
import { DOMSetupSection } from "../scripts/DOMSetupSection.js";
import { ShipType } from "../scripts/ShipType.js";
import { Direction } from  "../scripts/Direction.js";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
beforeEach(() => { document.documentElement.innerHTML = html; });

test("DOMSetupSection - grid populated", () => {
	const dom = new DOMSetupSection();
	let grid = document.getElementById("setup-grid");
	expect(grid.children.length).toBe(100);
});

test("DOMSetupSection - emit SetupFinished", () => {

	const dom = new DOMSetupSection();
	const listener = jest.fn();
	dom.hook("SetupFinished", listener);

	for(let i = 0; i < ShipType.AsArray.length; i++) {
		let shipType = ShipType.AsArray[i];
		dom.addSetupShip(shipType, 0, i, Direction.Up);
	}

	expect(listener).toHaveBeenCalledTimes(1);
});

const dragStart = (elem) => {
  const e = new Event("dragstart", { bubbles: true });
  e.dataTransfer = { setDragImage() {} };
  elem.dispatchEvent(e);
};

test("DOMSetupSection - Place Ship, emit SetupShipPlaced", () => {
	const section = new DOMSetupSection();
	const listener = jest.fn();
	section.hook("SetupShipPlaced", listener);

	const ship = document.querySelector('#setup-ship-container [data-ship-type="carrier"]');
	dragStart(ship);

	const cell = document.querySelector('#setup-grid [data-pos="3,4"]');
	cell.dispatchEvent(new Event("drop", { bubbles: true, cancelable: true }));

	expect(listener).toHaveBeenCalledWith({
		shipType: ShipType.Carrier,
		faceDirection: Direction.Up,
		row: 3, col: 4,
		team: 0,
	});
});

test("DOMSetupSection - Setup Ships", () => {

	const dom = new DOMSetupSection();
	const setupShips = document.querySelectorAll("#setup-ship-container > div");

	function findShip(refName) {
		for(let i = 0; i < setupShips.length; i++) {
			let ship = setupShips.item(i);
			let shipRefName = ship.dataset.shipType;
			if(shipRefName === refName) { return ship; }
		}
	}

	for(let i = 0; i < ShipType.AsArray.length; i++) {
		let shipType = ShipType.AsArray[i];

		let setupShip = findShip(shipType.refname);
		expect(setupShip).toBeTruthy();
		expect(setupShip.style.display).not.toBe("none");

		dom.addSetupShip(shipType, 0, i, Direction.Up);

		expect(setupShip.style.display).toBe("none");
	}
});

test("DOMSetupSection - show", () => {
	const dom = new DOMSetupSection();
	dom.show(1);

	// Check Setup Grid
	let grid = document.getElementById("setup-grid");
	let cells = grid.querySelectorAll(".grid-cell");

	expect(cells.length).toBe(100);

	for(let i = 0; i < cells.length; i++) {
		let row = Math.floor(i / 10);
		let col = Math.floor(i % 10);
		let cell = cells.item(i);
		expect(cell.className).toBe("grid-cell");
		expect(cell.dataset.pos).toBe(`${row},${col}`);
	}
});

test("DOMSetupSection - hide", () => {
	const dom = new DOMSetupSection();
	dom.hide();

	let page = document.getElementById("page-setup");
	expect(page.style.display).toBe("none");
});