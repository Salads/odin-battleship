import { test, expect } from "@jest/globals";
import { Gameboard } from "../scripts/Gameboard.js";
import { ShipType } from "../scripts/ShipType.js";
import { Direction } from "../scripts/Direction.js";

test("gameboard - add one ship", () => {
	let board = new Gameboard();
	expect(board.addShip(1, ShipType.Destroyer, 0, 1, Direction.Left)).toBe(true);
});

test("gameboard - add one ship, x-bounds underflow", () => {
	let board = new Gameboard();
	expect(board.addShip(1, ShipType.Destroyer, 0, 0, Direction.Right)).toBe(false);
});

test("gameboard - add one ship, x-bounds overflow", () => {
	let board = new Gameboard();
	expect(board.addShip(1, ShipType.Destroyer, 9, 9, Direction.Left)).toBe(false);
});

test("gameboard - add one ship, y-bounds underflow", () => {
	let board = new Gameboard();                                      
	expect(board.addShip(1, ShipType.Destroyer, 0, 0, Direction.Down)).toBe(false);
});

test("gameboard - add one ship, y-bounds overflow", () => {
	let board = new Gameboard();                                    
	expect(board.addShip(1, ShipType.Destroyer, 9, 9, Direction.Up)).toBe(false);
});

test("gameboard - add one ship per team", () => {
	let board = new Gameboard();
	board.addShip(1, ShipType.Destroyer, 0, 1, Direction.Left);
	board.addShip(2, ShipType.Destroyer, 3, 3, Direction.Left);
	expect(board.getTotalShips()).toBe(2);
});

test("gameboard - add 2 ship same team, collision", () => {
	let board = new Gameboard();
	board.addShip(1, ShipType.Destroyer, 0, 1, Direction.Left);
	expect(board.addShip(1, ShipType.Destroyer, 0, 1, Direction.Left)).toBe(false);
});

test("gameboard - check board fresh", () => {
	let board = new Gameboard();
	
	for(let i = 0; i < 10; i++) {
		for(let j = 0; j < 10; j++) {
			let tile = board.getBoardTile(1, i, j);
			expect(tile.ship || tile.hit).toBeFalsy();
		}
	}

	for(let i = 0; i < 10; i++) {
		for(let j = 0; j < 10; j++) {
			let tile = board.getBoardTile(2, i, j);
			expect(tile.ship || tile.hit).toBeFalsy();
		}
	}
});

test("gameboard - check board one ship", () => {
	let board = new Gameboard();
	let addShipResult = board.addShip(1, ShipType.PatrolBoat, 0, 0, Direction.Left);
	expect(addShipResult).toBeTruthy();
	
	for(let i = 0; i < 10; i++) {
		for(let j = 0; j < 10; j++) {
			let tile = board.getBoardTile(1, i, j);
			if(i === 0 && (j === 0 || j === 1)) {
				expect(tile.ship).toBeTruthy();
			}
			else if(tile.ship || tile.hit) { 
				expect(tile.ship || tile.hit).toBeFalsy();
			}
		}
	}
});

test("gameboard - hit single ship", () => {
	let board = new Gameboard();
	let addShipResult = board.addShip(1, ShipType.PatrolBoat, 0, 0, Direction.Left);
	expect(addShipResult).toBeTruthy();

	board.receiveAttack(1, 0, 0);
	let tile = board.getBoardTile(1, 0, 0);
	expect(tile.ship.isSunk()).toBe(false);
	expect(tile.hit).toBe(true);
	
	for(let i = 0; i < 10; i++) {
		for(let j = 0; j < 10; j++) {
			let tile = board.getBoardTile(1, i, j);
			if(i === 0 && (j === 0 || j === 1)) {
				expect(tile.ship).toBeTruthy();
				expect(tile.hit && j === 1).toBeFalsy();
			}
			else if(tile.ship || tile.hit) { 
				expect(tile.ship || tile.hit).toBeFalsy();
			}
		}
	}
});

test("gameboard - sink one ship, p1 remaining", () => {
	let board = new Gameboard();
	board.addShip(1, ShipType.PatrolBoat, 0, 0, Direction.Left);

	let beforeP1Ships = board.p1ShipsRemaining;
	board.receiveAttack(1, 0, 0);
	board.receiveAttack(1, 1, 0);
	let afterP1Ships = board.p1ShipsRemaining;
	expect(beforeP1Ships).toBe(1);
	expect(afterP1Ships).toBe(0);
});

test("gameboard - sink one ship, p2 remaining", () => {
	let board = new Gameboard();
	board.addShip(2, ShipType.PatrolBoat, 0, 0, Direction.Left);

	let beforeP2Ships = board.p2ShipsRemaining;
	board.receiveAttack(2, 0, 0);
	board.receiveAttack(2, 1, 0);
	let afterP2Ships = board.p2ShipsRemaining;
	expect(beforeP2Ships).toBe(1);
	expect(afterP2Ships).toBe(0);
});

test("gameboard - p1 miss", () => {
	let board = new Gameboard();
	board.addShip(2, ShipType.PatrolBoat, 0, 0, Direction.Left);
	board.receiveAttack(2, 2, 0);
	expect(board.p1MissCount).toBe(1);
});

test("gameboard - p2 miss", () => {
	let board = new Gameboard();
	board.addShip(1, ShipType.PatrolBoat, 0, 0, Direction.Left);
	board.receiveAttack(1, 2, 0);
	expect(board.p2MissCount).toBe(1);
});

test("gameboard - fresh p1 miss", () => {
	let board = new Gameboard();
	expect(board.p1MissCount).toBe(0);
});

test("gameboard - fresh p2 miss", () => {
	let board = new Gameboard();
	expect(board.p2MissCount).toBe(0);
});

test("gameboard - p1 win", () => {
	let board = new Gameboard();
	board.addShip(2, ShipType.PatrolBoat, 0, 0, Direction.Left);
	board.addShip(1, ShipType.PatrolBoat, 3, 0, Direction.Left);
	board.receiveAttack(2, 0, 0);
	board.receiveAttack(2, 1, 0);
	expect(board.getWinningTeam()).toBe(1);
});

test("gameboard - p2 win", () => {
	let board = new Gameboard();
	board.addShip(1, ShipType.PatrolBoat, 0, 0, Direction.Left);
	board.addShip(2, ShipType.PatrolBoat, 3, 0, Direction.Left);
	board.receiveAttack(1, 0, 0);
	board.receiveAttack(1, 1, 0);
	expect(board.getWinningTeam()).toBe(2);
});

test("gameboard - no win yet", () => {
	let board = new Gameboard();
	board.addShip(1, ShipType.PatrolBoat, 0, 0, Direction.Left);
	board.addShip(2, ShipType.PatrolBoat, 3, 0, Direction.Left);
	board.receiveAttack(1, 0, 0);
	expect(board.getWinningTeam()).toBe(0);
});