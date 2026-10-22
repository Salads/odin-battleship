import { test, expect, jest, beforeEach } from "@jest/globals";
import { readFileSync } from "node:fs";
import { DOMStartSection } from "../scripts/DOMStartSection.js";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf-8");
beforeEach(() => { document.documentElement.innerHTML = html; });

test("DOMStartSection - PVP Event", () => {
	const section = new DOMStartSection();
	const listener = jest.fn();

	section.hook("StartPvP", listener);
	document.getElementById("button-vs-player").click();
	expect(listener).toHaveBeenCalledTimes(1);
});

test("DOMStartSection - PVE Event", () => {
	const section = new DOMStartSection();
	const listener = jest.fn();

	section.hook("StartPvE", listener);
	document.getElementById("button-vs-bot").click();
	expect(listener).toHaveBeenCalledTimes(1);
});

test("DOMStartSection - show/hide", () => {
	const dom = new DOMStartSection();
	const section = document.getElementById("page-start");

	dom.show();
	expect(section.style.display).toBe("flex");

	dom.hide();
	expect(section.style.display).toBe("none");
});