import { test, expect } from "@jest/globals";
import { Ship } from "../scripts/Ship.js";

test("ship - hit, no sink", () => {
	expect((() => {
		let ship = new Ship([0, 0], 2);
		ship.hit();
		return ship.isSunk();
	})()).toBe(false);
});

test("ship - hit, sunk", () => {
	expect((() => {
		let ship = new Ship([0, 0], 1);
		ship.hit();
		return ship.isSunk();
	})()).toBe(true);
});