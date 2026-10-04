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
});