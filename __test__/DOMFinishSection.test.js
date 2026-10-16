import { readFileSync } from "node:fs";
import { test, expect, jest, beforeEach } from "@jest/globals";
import { DOMFinishSection } from "../scripts/DOMFinishSection.js";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf-8");
beforeEach(() => { document.documentElement.innerHTML = html; });

test("DOMFinishSection - show", () => {
	const dom = new DOMFinishSection();

	const domPage = document.getElementById("page-finished");
	const domTitle = domPage.querySelector(".page-title");
	
	dom.show(1);
	expect(domTitle.textContent).toBe(`Player ${1} Wins!`);
	expect(domPage.style.display).toBe("flex");
});

test("DOMFinishSection - hide", () => {
	const dom = new DOMFinishSection();

	const domPage = document.getElementById("page-finished");
	
	dom.hide();
	expect(domPage.style.display).toBe("none");
});

test("DOMFinishSection - event:FinishContinue", () => {
	const dom = new DOMFinishSection();
	const listener = jest.fn();
	dom.hook("FinishContinue", listener);

	const domButton = document.getElementById("finished-button");
	domButton.click();

	expect(listener).toHaveBeenCalledTimes(1);
});