import * as helpers from "./TestUtility.js";
import { readFileSync } from "node:fs";
import { test, expect, jest, beforeEach, afterEach } from "@jest/globals";
import { ShipType } from "../scripts/ShipType.js";
import { Battleship } from "../scripts/Battleship.js";
import { Bot } from "../scripts/Bot.js";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf-8");
beforeEach(() => { document.documentElement.innerHTML = html; });

const botMoveFunc = Bot.prototype.doMove;
afterEach(() => {Bot.prototype.doMove = botMoveFunc;});

test("Battleship - Full Run PVP", () => {
	const b = new Battleship();
	let shipPositions = [];

	// #region Start PVP Game

	expect(helpers.getSectionUniquelyActive(helpers.Section.Start)).toBe(true);
	helpers.startSection_clickPVPButton();
	expect(helpers.getSectionUniquelyActive(helpers.Section.Setup)).toBe(true);
	
	// #endregion

	// #region Setup Phase

	// P1 Setup
	expect(helpers.setupSection_getTitleText()).toBe("Player 1 Setup");
	for(let col = 0; col < ShipType.AsArray.length; col++) {
		let shipType = ShipType.AsArray[col];
		helpers.setupSection_dropShip(shipType, 0, col);
		shipPositions.push(... helpers.getShipPositions(shipType, 0, col));
	}

	// Transition Setup(1) => Setup(2)
	expect(helpers.getSectionUniquelyActive(helpers.Section.Hide)).toBe(true);
	helpers.hideSection_clickContinue();
	expect(helpers.getSectionUniquelyActive(helpers.Section.Setup)).toBe(true);

	// P2 Setup
	expect(helpers.setupSection_getTitleText()).toBe("Player 2 Setup");
	for(let col = 0; col < ShipType.AsArray.length; col++) {
		let shipType = ShipType.AsArray[col];
		helpers.setupSection_dropShip(shipType, 0, col);
	}

	// #endregion

	// #region Play Phase 

	// Transition Setup(2) => Play(1)
	expect(helpers.getSectionUniquelyActive(helpers.Section.Hide)).toBe(true);
	helpers.hideSection_clickContinue();

	expect(shipPositions.length).toBe(17);

	// Hit every ship-filled tile for each team.
	for(let shipPosIdx = 0; shipPosIdx < shipPositions.length; shipPosIdx++){
		for(let turnIdx = 0; turnIdx < 2; turnIdx++) {
			expect(helpers.getSectionUniquelyActive(helpers.Section.Play)).toBe(true);
			expect(helpers.playSection_getTitleText()).toBe(`Player ${turnIdx + 1}'s Turn!`);

			let nextHitPos = shipPositions[shipPosIdx];
			helpers.playSection_clickPlayCell(nextHitPos[0], nextHitPos[1]);

			if(shipPosIdx === shipPositions.length - 1) {
				break;
			}

			expect(helpers.getSectionUniquelyActive(helpers.Section.Hide)).toBe(true);
			helpers.hideSection_clickContinue();
		}
	}

	// #endregion

	expect(helpers.getSectionUniquelyActive(helpers.Section.Finish)).toBe(true);
	expect(helpers.finishSection_getTitleText()).toBe("Player 1 Wins!");

	helpers.finishSection_clickContinue();
	expect(helpers.getSectionUniquelyActive(helpers.Section.Start)).toBe(true);

});

test("Battleship - Full Run PVE", () => {
	const b = new Battleship();

	// NOTE(Salads): Mock bot doMove because it places ships randomly.
	Bot.prototype.doMove = () => {};

	// #region Start PVP Game

	expect(helpers.getSectionUniquelyActive(helpers.Section.Start)).toBe(true);
	helpers.startSection_clickPVEButton();
	expect(helpers.getSectionUniquelyActive(helpers.Section.Setup)).toBe(true);
	
	// #endregion

	// #region Setup Phase

	// P1 Setup
	expect(helpers.setupSection_getTitleText()).toBe("Player 1 Setup");
	for(let col = 0; col < ShipType.AsArray.length; col++) {
		let shipType = ShipType.AsArray[col];
		helpers.setupSection_dropShip(shipType, 0, col);
	}

	// #endregion

	// Transition Setup(1) => Play(1)
	expect(helpers.getSectionUniquelyActive(helpers.Section.Play)).toBe(true);

	// #region Play Phase 

	// Hit every tile until we get all of them.
	for(let row = 0; row < 10; row++) {
		for(let col = 0; col < 10; col++) {
			if(helpers.getSectionUniquelyActive(helpers.Section.Finish)) break;

			expect(helpers.getSectionUniquelyActive(helpers.Section.Play)).toBe(true);
			expect(helpers.playSection_getTitleText()).toBe("Player 1's Turn!");

			helpers.playSection_clickPlayCell(row, col);
		}

		if(helpers.getSectionUniquelyActive(helpers.Section.Finish)) break;
	}

	// #endregion

	expect(helpers.getSectionUniquelyActive(helpers.Section.Finish)).toBe(true);
	expect(helpers.finishSection_getTitleText()).toBe("Player 1 Wins!");

	helpers.finishSection_clickContinue();
	expect(helpers.getSectionUniquelyActive(helpers.Section.Start)).toBe(true);

});