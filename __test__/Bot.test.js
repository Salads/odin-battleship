import { jest, test, expect } from "@jest/globals";
import { Bot } from "../scripts/Bot.js";
import { ShipType } from "../scripts/ShipType.js";
import { Direction } from "../scripts/Direction.js";
import { PlayerState } from "../scripts/PlayerState.js";

function hitCoords(board) {
    let out = [];
    for (let row = 0; row < 10; row++) {
		for (let col = 0; col < 10; col++) {
			if (board[row][col].hit) {
				out.push([row, col]);
			}
		}
	}
        
    return out;
}

test("bot - hunt", () => {
	let p1 = new PlayerState(1);
	let p2 = new PlayerState(2);
	let b = new Bot(p2, p1);

	p1.addShip(ShipType.Destroyer, 0, 0, Direction.Left);

	jest.spyOn(Math, "random").mockReturnValueOnce(0);
	b.doMove(); b.doMove(); b.doMove(); b.doMove();
	expect(hitCoords(p1.board)).toEqual([[0,0],[0,1],[0,2],[0,3]]); 
});

test("bot - exactly one attack per doMove across hunt + fallback", () => {
	jest.spyOn(Math, "random").mockReturnValueOnce(0);
	
	let p1 = new PlayerState(1);
	let p2 = new PlayerState(2);
	let b = new Bot(p2, p1);
	p1.addShip(ShipType.Destroyer, 0, 0, Direction.Left);

	jest.spyOn(p1, "receiveAttack");

	let prevCount = 0;
	for(let i = 0; i < 6; i++) {
		b.doMove();
		let count = p1.receiveAttack.mock.calls.length;
		expect(count - prevCount === 1).toBe(true);
		prevCount = count;
	}
});

test("bot - team", () => {
	let p1 = new PlayerState(1);
	let p2 = new PlayerState(2);
	let b = new Bot(p2, p1);
	expect(p2.team === b.team).toBe(true);
});

test("bot - placeShips", () => {
	let p1 = new PlayerState(1);
	let p2 = new PlayerState(2);
	let b = new Bot(p2, p1);

	b.placeShips();

	expect(p2.totalShips).toBe(5);
});