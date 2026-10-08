import { test, expect } from "@jest/globals";
import { Ship } from "../scripts/Ship.js";
import { Direction } from "../scripts/Direction.js";
import { ShipType } from "../scripts/ShipType.js";

test("ship - pos", () => {
	let ship = new Ship(ShipType.PatrolBoat, 2, 5, Direction.Left);
	let shipPos = ship.getPos();
	expect(shipPos.x).toBe(2);
	expect(shipPos.y).toBe(5);
});

test("ship - hit, no sink", () => {
	let ship = new Ship(ShipType.PatrolBoat, 0, 0, Direction.Left);
	ship.hit();
	expect(ship.isSunk()).toBe(false);
});

test("ship - hit, sunk", () => {
	let ship = new Ship(ShipType.PatrolBoat, 0, 0, Direction.Left);
	ship.hit();
	let oldSink = ship.isSunk();
	ship.hit();
	expect(!oldSink).toBe(true);
	expect(ship.isSunk()).toBe(true);
});

test("ship - name", () => {
	let ship = new Ship(ShipType.PatrolBoat, 0, 0, Direction.Left);
	expect(ship.name).toBe(ShipType.PatrolBoat.name);
});

test("ship - range (left)", () => {
	let ship = new Ship(ShipType.Battleship, 0, 0, Direction.Left);
	let shipRange = ship.getRange();
	expect(shipRange.start).toBe(0);
	expect(shipRange.end).toBe(3);
});

test("ship - range (up)", () => {
	let ship = new Ship(ShipType.Battleship, 0, 0, Direction.Up);
	let shipRange = ship.getRange();
	expect(shipRange.start).toBe(0);
	expect(shipRange.end).toBe(3);
});


test("ship - range (right)", () => {
	let ship = new Ship(ShipType.Battleship, 3, 0, Direction.Right);
	let shipRange = ship.getRange();
	expect(shipRange.start).toBe(0);
	expect(shipRange.end).toBe(3);
});


test("ship - range (down)", () => {
	let ship = new Ship(ShipType.Battleship, 0, 3, Direction.Down);
	let shipRange = ship.getRange();
	expect(shipRange.start).toBe(0);
	expect(shipRange.end).toBe(3);
});


test("ship - range span matches size (left)", () => {
	let ship = new Ship(ShipType.PatrolBoat, 0, 0, Direction.Left);
	let r = ship.getRange();
	expect(r.end - r.start).toBe(ShipType.PatrolBoat.size - 1);
});

test("ship - range span matches size (up)", () => {
	let ship = new Ship(ShipType.PatrolBoat, 0, 0, Direction.Up);
	let r = ship.getRange();
	expect(r.end - r.start).toBe(ShipType.PatrolBoat.size - 1);
});

test("ship - range span matches size (right)", () => {
	let ship = new Ship(ShipType.PatrolBoat, 4, 4, Direction.Right);
	let r = ship.getRange();
	expect(r.end - r.start).toBe(ShipType.PatrolBoat.size - 1);
});

test("ship - range span matches size (down)", () => {
	let ship = new Ship(ShipType.PatrolBoat, 4, 4, Direction.Down);
	let r = ship.getRange();
	expect(r.end - r.start).toBe(ShipType.PatrolBoat.size - 1);
});