import { test, expect } from "@jest/globals";
import { Ship } from "../scripts/Ship.js";
import { Direction } from "../scripts/Direction.js";
import { ShipType } from "../scripts/ShipType.js";

test("ship - pos", () => {
	expect((() => {
		let ship = new Ship(ShipType.PatrolBoat, 2, 5, Direction.Left);
		let shipPos = ship.getPos();
		return shipPos.x === 2 && shipPos.y === 5;
	})()).toBe(true);
});

test("ship - hit, no sink", () => {
	expect((() => {
		let ship = new Ship(ShipType.PatrolBoat, 0, 0, Direction.Left);
		ship.hit();
		return ship.isSunk();
	})()).toBe(false);
});

test("ship - hit, sunk", () => {
	expect((() => {
		let ship = new Ship(ShipType.PatrolBoat, 0, 0, Direction.Left);
		ship.hit();
		let oldSink = ship.isSunk();
		ship.hit();
		return !oldSink && ship.isSunk();
	})()).toBe(true);
});

test("ship - name", () => {
	expect((() => {
		let ship = new Ship(ShipType.PatrolBoat, 0, 0, Direction.Left);
		return ship.name === ShipType.PatrolBoat.name;
	})()).toBe(true);
});

test("ship - range", () => {
	expect((() => {
		let ship = new Ship(ShipType.Battleship, 0, 0, Direction.Left);
		let shipRange = ship.getRange();
		return shipRange.start === 0 && shipRange.end === 3;
	})()).toBe(true);
});

test("ship - range span matches size (left)", () => {
	expect((() => {
		let ship = new Ship(ShipType.PatrolBoat, 0, 0, Direction.Left);
		let r = ship.getRange();
		return r.end - r.start;
	})()).toBe(ShipType.PatrolBoat.size - 1);
});

test("ship - range span matches size (up)", () => {
	expect((() => {
		let ship = new Ship(ShipType.PatrolBoat, 0, 0, Direction.Up);
		let r = ship.getRange();
		return r.end - r.start;
	})()).toBe(ShipType.PatrolBoat.size - 1);
});

test("ship - range span matches size (right)", () => {
	expect((() => {
		let ship = new Ship(ShipType.PatrolBoat, 4, 4, Direction.Right);
		let r = ship.getRange();
		return r.end - r.start;
	})()).toBe(ShipType.PatrolBoat.size - 1);
});

test("ship - range span matches size (down)", () => {
	expect((() => {
		let ship = new Ship(ShipType.PatrolBoat, 4, 4, Direction.Down);
		let r = ship.getRange();
		return r.end - r.start;
	})()).toBe(ShipType.PatrolBoat.size - 1);
});