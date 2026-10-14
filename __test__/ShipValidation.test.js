import { test, expect } from "@jest/globals";
import { validateShipPlacement } from "../scripts/ShipValidation.js";
import { ShipType } from "../scripts/ShipType.js";
import { Direction } from "../scripts/Direction.js";
import { PlayerState } from "../scripts/PlayerState.js";

test("ship placement - empty board", () => {
	let p = new PlayerState(1);
	let valid = validateShipPlacement(p.board, ShipType.PatrolBoat, 0, 0, Direction.Up);
	expect(valid).toBe(true);
});

test("ship placement - collision", () => {
	let p = new PlayerState(1);
	p.addShip(ShipType.PatrolBoat, 0, 0, Direction.Up);
	let valid = validateShipPlacement(p.board, ShipType.PatrolBoat, 0, 0, Direction.Up);
	expect(valid).toBe(false);
});

test("ship placement - OOB x", () => {
	let p = new PlayerState(1);
	let valid = validateShipPlacement(p.board, ShipType.PatrolBoat, 0, 9, Direction.Left);
	expect(valid).toBe(false);
});

test("ship placement - OOB y", () => {
	let p = new PlayerState(1);
	let valid = validateShipPlacement(p.board, ShipType.PatrolBoat, 9, 0, Direction.Up);
	expect(valid).toBe(false);
});
