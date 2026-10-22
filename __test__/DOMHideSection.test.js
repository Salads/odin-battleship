import { readFileSync } from "node:fs";
import { test, expect, jest, beforeEach } from "@jest/globals";
import { DOMHideSection } from "../scripts/DOMHideSection.js";
import * as helpers from "./TestUtility.js";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf-8");
beforeEach(() => { document.documentElement.innerHTML = html; });

test("DOMHideSection - show", () => {
	const dom = new DOMHideSection();
	dom.show(1);

	const section = document.getElementById("page-hide");
	const title = section.querySelector(".page-title");
	expect(title.textContent).toBe("Pass to player 1!");

	expect(helpers.getSectionUniquelyActive(helpers.Section.Hide)).toBe(true);
});

test("DOMHideSection - hide", () => {
	const dom = new DOMHideSection();
	dom.hide();
	const section = helpers.getSection(helpers.Section.Hide);
	expect(section.style.display).toBe("none");
});

test("DOMHideSection - HideContinue emits", () => {
	const dom = new DOMHideSection();

	const listener = jest.fn();
	dom.hook("HideContinue", listener);

	const button = document.getElementById("hide-continue");
	button.click();

	expect(listener).toHaveBeenCalledTimes(1);
});