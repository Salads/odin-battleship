import { test, expect } from "@jest/globals";
import { Pos } from "../scripts/Pos.js";

test("pos - set and get", () => {
	expect((() => {
		let p = new Pos(6, 7);
		return p.x === 6 && p.y === 7;
	})()).toBe(true);
});

// #region x types
test("pos - x:null", () => {
	expect(() => new Pos(null, 0)).toThrow();
});

test("pos - x:undefined", () => {
	expect(() => new Pos(undefined, 0)).toThrow();
});

test("pos - x:float", () => {
	expect(() => new Pos(0.5, 0)).toThrow();
});

test("pos - x:string", () => {
	expect(() => new Pos("hi", 0)).toThrow();
});

test("pos - x:Object", () => {
	expect(() => new Pos({}, 0)).toThrow();
});

test("pos - x:BigInt", () => {
	expect(() => new Pos(BigInt(Number.MAX_SAFE_INTEGER + 12), 0)).toThrow();
});

test("pos - x:Symbol", () => {
	expect(() => new Pos(Symbol("foo"), 0)).toThrow();
});
// #endregion

// #region y types
test("pos - y:null", () => {
	expect(() => new Pos(0, null)).toThrow();
});

test("pos - y:undefined", () => {
	expect(() => new Pos(0, undefined)).toThrow();
});

test("pos - y:float", () => {
	expect(() => new Pos(0, 0.5)).toThrow();
});

test("pos - y:string", () => {
	expect(() => new Pos(0, "hi")).toThrow();
});

test("pos - y:Object", () => {
	expect(() => new Pos(0, {})).toThrow();
});

test("pos - y:BigInt", () => {
	expect(() => new Pos(0, BigInt(Number.MAX_SAFE_INTEGER + 12))).toThrow();
});

test("pos - y:Symbol", () => {
	expect(() => new Pos(0, Symbol("foo"))).toThrow();
});
// #endregion