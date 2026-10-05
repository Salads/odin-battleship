import { test, expect } from "@jest/globals";
import { Gameboard } from "../scripts/Gameboard.js";
import { ShipType } from "../scripts/ShipType.js";
import { Direction } from "../scripts/Direction.js";
import { Ship } from "../scripts/Ship.js";

test("gameboard - add one ship", () => {
	expect((() => {
		let board = new Gameboard();
		return board.addShip(1, ShipType.Destroyer, 0, 1, Direction.Left);
	})()).toBe(true);
});

test("gameboard - add one ship, x-bounds underflow", () => {
	expect((() => {
		let board = new Gameboard();
		return board.addShip(1, ShipType.Destroyer, 0, 0, Direction.Right);
	})()).toBe(false);
});

test("gameboard - add one ship, x-bounds overflow", () => {
	expect((() => {
		let board = new Gameboard();
		return board.addShip(1, ShipType.Destroyer, 9, 9, Direction.Left);
	})()).toBe(false);
});

test("gameboard - add one ship, y-bounds underflow", () => {
	expect((() => {
		let board = new Gameboard();
		return board.addShip(1, ShipType.Destroyer, 0, 0, Direction.Down);
	})()).toBe(false);
});

test("gameboard - add one ship, y-bounds overflow", () => {
	expect((() => {
		let board = new Gameboard();
		return board.addShip(1, ShipType.Destroyer, 9, 9, Direction.Up);
	})()).toBe(false);
});

test("gameboard - add one ship per team", () => {
	expect((() => {
		let board = new Gameboard();
		board.addShip(1, ShipType.Destroyer, 0, 1, Direction.Left);
		board.addShip(2, ShipType.Destroyer, 3, 3, Direction.Left);
		return board.getTotalShips() === 2;
	})()).toBe(true);
});

test("gameboard - add 2 ship same team, collision", () => {
	expect((() => {
		let board = new Gameboard();
		board.addShip(1, ShipType.Destroyer, 0, 1, Direction.Left);
		return board.addShip(1, ShipType.Destroyer, 0, 1, Direction.Left);
	})()).toBe(false);
});