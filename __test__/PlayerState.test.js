import { test, expect } from "@jest/globals";
import { PlayerState } from "../scripts/PlayerState.js";
import { ShipType } from "../scripts/ShipType.js";
import { Direction } from "../scripts/Direction.js";
import { Ship } from "../scripts/Ship.js";

test("playerstate - empty board valid", () => {
	let p = new PlayerState(1);
	let b = p.board;

	let expectedObj = { ship: null, hit: false };

	expect(b.length).toBe(10);
	for(let row = 0; row < 10; row++) {

		expect(b[row].length).toBe(10);

		for(let col = 0; col < 10; col++) {
			let tile = b[row][col];
			expect(tile).toEqual(expectedObj);
		}
	}
});

test("playerstate - addShip - board state", () => {
	let p = new PlayerState(1);
	let b = p.board;

	p.addShip(ShipType.PatrolBoat, 0, 0, Direction.Left);
	let emptyTile = { ship: null, hit: false };

	let patrolBoatColumns = [0, 1];
	for(let row = 0; row < 10; row++) {
		for(let col = 0; col < 10; col++) {
			let tile = b[row][col];
			if(row === 0 && patrolBoatColumns.includes(col)) {
				expect(tile.ship).toBeTruthy();
			}
			else {
				expect(tile).toEqual(emptyTile);
			}
		}
	}
});

test("playerstate - addShip valid", () => {
	let p = new PlayerState(1);
	let success = p.addShip(ShipType.PatrolBoat, 0, 0, Direction.Left);
	expect(success).toBe(true);
});

test("playerstate - addShip collision", () => {
	let p = new PlayerState(1);
	p.addShip(ShipType.PatrolBoat, 0, 0, Direction.Left);
	let success = p.addShip(ShipType.Submarine, 0, 0, Direction.Up);
	expect(success).toBe(false);
});

test("playerstate - addShip duplicate ship", () => {
	let p = new PlayerState(1);
	p.addShip(ShipType.PatrolBoat, 0, 0, Direction.Left);
	expect(() => p.addShip(ShipType.PatrolBoat, 1, 1, Direction.Up)).toThrow();
});

test("playerstate - receiveAttack - miss", () => {
	let p = new PlayerState(1);
	let hit = p.receiveAttack(0, 0);
	expect(hit).toBe(false);
});

test("playerstate - receiveAttack - hit", () => {
	let p = new PlayerState(1);
	p.addShip(ShipType.PatrolBoat, 0, 0, Direction.Left);
	let hit = p.receiveAttack(0, 0);
	expect(hit).toBe(true);
});

test("playerstate - receiveAttack - hit twice", () => {
	let p = new PlayerState(1);
	p.receiveAttack(0, 0);
	expect(() => p.receiveAttack(0, 0)).toThrow();
});

test("playerstate - reset", () => {
	let p = new PlayerState(1);
	p.addShip(ShipType.PatrolBoat, 0, 0, Direction.Left);
	p.addShip(ShipType.Submarine, 1, 0, Direction.Left);

	p.miss();
	expect(p.missCount).toBe(1);

	p.hit();
	expect(p.hitCount).toBe(1);

	p.receiveAttack(0, 0);
	p.receiveAttack(0, 1);
	expect(p.shipsRemaining).toBe(1);
	expect(p.ships.length).toBe(2);
	expect(p.ships[0].type).toBe(ShipType.PatrolBoat);
	expect(p.ships[1].type).toBe(ShipType.Submarine);
	expect(p.team).toBe(1);

	p.reset();

	let emptyTile = { ship: null, hit: false };

	for(let row = 0; row < 10; row++){
		for(let col = 0; col < 10; col++) {
			let tile = p.getTile(row, col);
			expect(tile).toEqual(emptyTile);
		}
	}

	expect(p.shipsRemaining).toBe(0);
	expect(p.ships.length).toBe(0);
	expect(p.team).toBe(1);
});

test("PlayerState - stats", () => {
	let p1 = new PlayerState(1);
	p1.addShip(ShipType.PatrolBoat, 0, 0, Direction.Left);

	let p2 = new PlayerState(2);
	p2.addShip(ShipType.PatrolBoat, 0, 0, Direction.Left);

	p1.attack(p2, 0, 0);
	p1.attack(p2, 0, 2);

	expect(p1.missCount).toBe(1);
	expect(p1.hitCount).toBe(1);
});