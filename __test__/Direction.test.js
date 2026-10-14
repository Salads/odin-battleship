import { test, expect } from "@jest/globals";
import { Direction } from "../scripts/Direction.js";

test("Direction - Value: Up", () => {
	expect(Direction.Up).toBe("Up");
});

test("Direction - Value: Right", () => {
	expect(Direction.Right).toBe("Right");
});

test("Direction - Value: Down", () => {
	expect(Direction.Down).toBe("Down");
});

test("Direction - Value: Left", () => {
	expect(Direction.Left).toBe("Left");
});

test("Direction - isFrozen", () => {
	expect(Object.isFrozen(Direction)).toBe(true);
	expect(Object.isFrozen(Direction.AsArray)).toBe(true);
	expect(Object.isFrozen(Direction.getOppositeDirection)).toBe(true);
});

test("Direction - opposite left", () => {
	let d = Direction.getOppositeDirection(Direction.Left);
	expect(d).toBe(Direction.Right);
});

test("Direction - opposite up", () => {
	let d = Direction.getOppositeDirection(Direction.Up);
	expect(d).toBe(Direction.Down);
});

test("Direction - opposite right", () => {
	let d = Direction.getOppositeDirection(Direction.Right);
	expect(d).toBe(Direction.Left);
});

test("Direction - opposite down", () => {
	let d = Direction.getOppositeDirection(Direction.Down);
	expect(d).toBe(Direction.Up);
});