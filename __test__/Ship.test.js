import { test, expect } from "@jest/globals";
import { Ship } from "../scripts/Ship.js";
import { Direction } from "../scripts/Direction.js";
import { Pos } from "../scripts/Pos.js";

test("ship - hit, no sink", () => {
	expect((() => {
		let ship = new Ship(0, 0, Direction.Left, 2, "Ship");
		ship.hit();
		return ship.isSunk();
	})()).toBe(false);
});

test("ship - hit, sunk", () => {
	expect((() => {
		let ship = new Ship(0, 0, Direction.Left, 1, "Ship");
		ship.hit();
		return ship.isSunk();
	})()).toBe(true);
});

test("ship - name", () => {
	expect((() => {
		let ship = new Ship(0, 0, Direction.Left, 1, "Ship");
		return ship.getName() === "Ship";
	})()).toBe(true);
});