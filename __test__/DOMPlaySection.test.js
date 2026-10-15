import { readFileSync } from "node:fs";
import { test, expect, jest, beforeEach } from "@jest/globals";
import { PlayerState } from "../scripts/PlayerState.js";
import { DOMPlaySection } from "../scripts/DOMPlaySection.js";
import { ShipType } from "../scripts/ShipType.js";
import { Direction } from "../scripts/Direction.js";
import { getCellConfig } from "../scripts/DOMCommon.js";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf-8");
beforeEach(() => {document.documentElement.innerHTML = html;});

test("DOMPlaySection - Grid Elements Created", () => {
	const dom = new DOMPlaySection();

	const attackGrid = document.getElementById("play-topgrid");
	expect(attackGrid.children.length).toBe(100);

	const statusGrid = document.getElementById("play-botgrid");
	expect(statusGrid.children.length).toBe(100);
});

test("DOMPlaySection - show", () => {
	const dom = new DOMPlaySection();
	
	const friendState = new PlayerState(1);
	friendState.addShip(ShipType.PatrolBoat, 0, 0, Direction.Left);
	friendState.receiveAttack(0, 0);
	friendState.receiveAttack(0, 2);

	const enemyState = new PlayerState(2);
	enemyState.addShip(ShipType.PatrolBoat, 0, 0, Direction.Left);
	enemyState.receiveAttack(0, 1);
	enemyState.receiveAttack(0, 2);

	dom.show(friendState, enemyState);

	const page = document.getElementById("page-play");
	expect(page.style.display).toBe("block");

	// Check Attack Grid
	let attackGridCells = document.getElementById("play-topgrid").children;
	for(let i = 0; i < attackGridCells.length; i++) {
		let domCell = attackGridCells.item(i);
		let row = Math.floor(i / 10);
		let col = Math.floor(i % 10);
		let stateCell = enemyState.board[row][col];
		
		expect(domCell.dataset.pos).toBe(`${row},${col}`);

		if(stateCell.hit) {
			expect(domCell.classList.length).toBe(2);
			expect(domCell.classList.contains("grid-cell")).toBe(true);

			if(stateCell.ship) {
				expect(domCell.classList.contains("hit")).toBe(true);
			}
			else {
				expect(domCell.classList.contains("miss")).toBe(true);
			}
		}		
		else {
			expect(domCell.classList.length).toBe(1);
			expect(domCell.classList.contains("grid-cell")).toBe(true);
		}
	}

	// Check Status Grid (Check ships and hit/miss)
	let statusGridCells = document.getElementById("play-botgrid").children;
	for(let i = 0; i < statusGridCells.length; i++) {
		let domCell = statusGridCells.item(i);
		let row = Math.floor(i / 10);
		let col = Math.floor(i % 10);
		let stateCell = friendState.board[row][col];
		
		expect(domCell.dataset.pos).toBe(`${row},${col}`);

		if(stateCell.ship) {
			let shipType = stateCell.ship.type;
			let startRow = stateCell.ship.row;
			let startCol = stateCell.ship.col;
			let faceDir = stateCell.ship.direction;
			let config = getCellConfig(shipType, startRow, startCol, row, col, faceDir);

			let domStyle = window.getComputedStyle(domCell);
			expect(domStyle.getPropertyValue("--ship-texture")).toBe(config.texture);

			expect(domCell.classList.contains("grid-cell")).toBe(true);
			expect(domCell.classList.contains(config.tileClass)).toBe(true);
			expect(domCell.classList.contains(config.rotateClass)).toBe(true);

			// base cell + ship tile + ship rotation + [hit/miss]
			if(stateCell.hit) {
				expect(domCell.classList.length).toBe(4);
				expect(domCell.classList.contains("hit")).toBe(true);
			}
			else {
				expect(domCell.classList.length).toBe(3);
			}
		}
		else if(!stateCell.ship && stateCell.hit) {
			expect(domCell.classList.length).toBe(2);
			expect(domCell.classList.contains("grid-cell")).toBe(true);
			expect(domCell.classList.contains("miss")).toBe(true);
		}
		else if(!stateCell.ship && !stateCell.hit) {
			expect(domCell.classList.length).toBe(1);
			expect(domCell.classList.contains("grid-cell")).toBe(true);
		}
	}

	// Check Play Stats
	const domMissCount = document.getElementById("miss-count");
	expect(domMissCount.textContent).toBe(`${friendState.missCount} Misses`);
	const domHitCount = document.getElementById("hit-count");
	expect(domHitCount.textContent).toBe(`${friendState.hitCount} Hits`);
});

test("DOMPlaySection - hide", () => {
	const dom = new DOMPlaySection();
	dom.hide();

	let page = document.getElementById("page-play");
	expect(page.style.display).toBe("none");
});