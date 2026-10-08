import { test, expect } from "@jest/globals";
import { Range } from "../scripts/Range.js";

test("Range - construction", () => {
	let range = new Range(0, 1);
	expect(range.start).toBe(0);
	expect(range.end).toBe(1);
});

test("Range - set start - valid", () => {
	let range = new Range(0, 2);
	range.start = 1;
	expect(range.start).toBe(1);
});

test("Range - set start - switch", () => {
	let range = new Range(0, 2);
	range.start = 3;
	expect(range.start).toBe(2);
	expect(range.end).toBe(3);
});

test("Range - set end - switch", () => {
	let range = new Range(3, 3);
	range.end = 2;
	expect(range.start).toBe(2);
	expect(range.end).toBe(3);
});

test("Range - set both", () => {
	let range = new Range(3, 3);
	range.set(2, 2);
	expect(range.start).toBe(2);
	expect(range.end).toBe(2);
});

test("Range - set both - swap", () => {
	let range = new Range(3, 3);
	range.set(3, 1);
	expect(range.start).toBe(1);
	expect(range.end).toBe(3);
});