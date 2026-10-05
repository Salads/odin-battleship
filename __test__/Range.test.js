import { test, expect } from "@jest/globals";
import { Range } from "../scripts/Range.js";

test("Range - construction", () => {
	expect((() => {
		let range = new Range(0, 1);
		return range.start === 0 && range.end === 1;
	})()).toBe(true);
});

test("Range - set start - valid", () => {
	expect((() => {
		let range = new Range(0, 2);
		range.start = 1;
		return range.start === 1;
	})()).toBe(true);
});

test("Range - set start - switch", () => {
	expect((() => {
		let range = new Range(0, 2);
		range.start = 3;
		return range.start === 2 && range.end === 3;
	})()).toBe(true);
});

test("Range - set end - switch", () => {
	expect((() => {
		let range = new Range(3, 3);
		range.end = 2;
		return range.start === 2 && range.end === 3;
	})()).toBe(true);
});

test("Range - set both", () => {
	expect((() => {
		let range = new Range(3, 3);
		range.set(2, 2);
		return range.start === 2 && range.end === 2;
	})()).toBe(true);
});

test("Range - set both - swap", () => {
	expect((() => {
		let range = new Range(3, 3);
		range.set(3, 1);
		return range.start === 1 && range.end === 3;
	})()).toBe(true);
});