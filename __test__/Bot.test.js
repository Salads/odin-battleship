import { jest, test, expect } from "@jest/globals";
import { Bot } from "../scripts/Bot.js";
import { Gameboard } from "../scripts/Gameboard.js";
import { ShipType } from "../scripts/ShipType.js";
import { Direction } from "../scripts/Direction.js";

function hitCoords(board, team) {
    const out = [];
    for (let y = 0; y < 10; y++)
        for (let x = 0; x < 10; x++)
            if (board.getBoardTile(team, y, x).hit) out.push([x, y]);
    return out;
}

test("bot - hunt", () => {
	jest.spyOn(Math, "random").mockReturnValueOnce(0);
	let board = new Gameboard();
	board.addShip(1, ShipType.Destroyer, 0, 0, Direction.Left);
	const bot = new Bot(board, 2);
	bot.doMove(); bot.doMove(); bot.doMove(); bot.doMove();
	expect(hitCoords(board, 1)).toEqual([[0,0],[1,0],[2,0],[3,0]]); 
});

test("bot - exactly one attack per doMove across hunt + fallback", () => {
	jest.spyOn(Math, "random").mockReturnValue(0);
	let board = new Gameboard();
	board.addShip(1, ShipType.Destroyer, 0, 0, Direction.Left);
	let bot = new Bot(board, 2);

	jest.spyOn(board, "receiveAttack");

	let prevCount = 0;
	for(let i = 0; i < 6; i++) {
		bot.doMove();
		let count = board.receiveAttack.mock.calls.length;
		expect(count - prevCount === 1).toBe(true);
		prevCount = count;
	}
});