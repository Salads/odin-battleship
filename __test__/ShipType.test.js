import { test, expect } from "@jest/globals";
import { ShipType } from "../scripts/ShipType.js";

test("shiptype - freeze", () => {
	expect(Object.isFrozen(ShipType)).toBe(true);
});

test("shiptype - freeze:Carrier", () => {
	expect(Object.isFrozen(ShipType.Carrier)).toBe(true);
});

test("shiptype - freeze:Battleship", () => {
	expect(Object.isFrozen(ShipType.Battleship)).toBe(true);
});

test("shiptype - freeze:Destroyer", () => {
	expect(Object.isFrozen(ShipType.Destroyer)).toBe(true);
});

test("shiptype - freeze:Submarine", () => {
	expect(Object.isFrozen(ShipType.Submarine)).toBe(true);
});

test("shiptype - freeze:PatrolBoat", () => {
	expect(Object.isFrozen(ShipType.PatrolBoat)).toBe(true);
});