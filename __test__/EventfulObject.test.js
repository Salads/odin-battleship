import { test, expect } from "@jest/globals";
import { EventfulObject } from "../scripts/EventfulObject.js";

test("hook and emit (function)", () => {
	let callbackRan = false;
	let obj = new EventfulObject();
	obj.hook("testEvent", (e) => {
		expect(e).toBe(true);
		callbackRan = true;
	});

	obj.emit("testEvent", true);
	expect(callbackRan).toBe(true);
});

test("hook and emit (obj.handleEvent)", () => {
	let callbackRan = false;
	let eObj = new EventfulObject();
	let obj = { 
		handleEvent(e) {
			expect(e).toBe(true);
			callbackRan = true;
		}
	};

	eObj.hook("testEvent", obj);
	eObj.emit("testEvent", true);
	expect(callbackRan).toBe(true);
});