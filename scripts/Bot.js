import { Pos } from "./Pos.js";
import { Direction } from "./Direction.js";

const posDeltas = Object.freeze({
	[Direction.Up]   : Object.freeze(new Pos(0, -1)),
	[Direction.Right]: Object.freeze(new Pos(1, 0)),
	[Direction.Down] : Object.freeze(new Pos(0, 1)),
	[Direction.Left] : Object.freeze(new Pos(-1, 0))
});

export class Bot {

	#gameboard;
	#team;
	#enemyTeam;
	#lastSuccessfulHit = null;

	constructor(enemyGameboard, botTeam) {
		this.gameboard = enemyGameboard;
		this.#team = botTeam;
		this.#enemyTeam = (botTeam === 1 ? 2 : 1);
	}

	get team() {
		return this.#team;
	}

	#getOppositeDirection(direction) {
		if(direction === Direction.Up) { 
			return Direction.Down; 
		}
		else if(direction === Direction.Right) {
			return Direction.Left;
		}
		else if(direction === Direction.Down) {
			return Direction.Up;
		}
		else if(direction === Direction.Left) {
			return Direction.Right;
		}
	}

	#findNextTile() {
		if(!this.#lastSuccessfulHit) { return null; }
		let lastHit = this.#lastSuccessfulHit;
		let directions = [];
		for(let dir in Direction) {
			directions.push(dir);
		}

		let curDirection = lastHit.otherDirection ?? lastHit.direction;
		if(!curDirection) {
			curDirection = Direction.Up;
		}

		let done = false;
		while(!done) {
			let x = lastHit.currentPos.x;
			let y = lastHit.currentPos.y;
			let dp = posDeltas[curDirection];
			let newTilePos = new Pos(x + dp.x, y + dp.y);

			if(!newTilePos.isValid(0, 9)) {
				let dx = Math.abs(lastHit.startingPos.x - newTilePos.x);
				let dy = Math.abs(lastHit.startingPos.y - newTilePos.y);
				lastHit.failedDirections.add(curDirection);

				// Already checked 1+ tiles, which means we found axis, go opp dir.
				if(dx > 1 || dy > 1) {
					lastHit.otherDirection = this.#getOppositeDirection(curDirection);
					lastHit.currentPos.set(lastHit.startingPos.x, lastHit.startingPos.y);
				}
				else { // First tile failed, go next dir.
					if(lastHit.failedDirections.size >= 4 || lastHit.otherDirection) { 
						return null; 
					}

					let nextIdx = directions.findIndex((elem, idx, arr) => {
						return idx > 0 && arr[idx - 1] === curDirection;
					});

					curDirection = directions[nextIdx];
				}
			}
			else {
				let tile = this.#gameboard.getBoardTile(this.#enemyTeam, newTilePos.y, newTilePos.x);
				if(!tile.hit) {
					lastHit.currentPos = newTilePos;
					return { x: newTilePos.x, y: newTilePos.y };
				}
				else {

					let dx = Math.abs(lastHit.startingPos.x - newTilePos.x);
					let dy = Math.abs(lastHit.startingPos.y - newTilePos.y);
					lastHit.failedDirections.add(curDirection);

					// Already checked 1+ tiles, which means we found axis, go opp dir.
					if(dx > 1 || dy > 1) {
						lastHit.otherDirection = this.#getOppositeDirection(curDirection);
						lastHit.currentPos.set(lastHit.startingPos.x, lastHit.startingPos.y);
					}
					else { // First tile failed, go next dir.
						if(lastHit.failedDirections.size >= 4 || lastHit.otherDirection) { 
							return null; 
						}

						let nextIdx = directions.findIndex((elem, idx, arr) => {
							return idx > 0 && arr[idx - 1] === curDirection;
						});

						curDirection = directions[nextIdx];
					}
				}
			}
		}
	}

	#attackRandomTile() {
		// Get all tiles and pick one randomly.
		let targets = this.#gameboard.getTileTargetsForTeam(this.#enemyTeam);
		let randIdx = Math.floor(Math.random() * targets.length);
		let target = targets[randIdx];
		let hit = this.#gameboard.receiveAttack(this.#enemyTeam, target.x, target.y);

		if(hit) {
			this.#lastSuccessfulHit = { 
				startingPos: new Pos(target.x, target.y),
				currentPos: new Pos(target.x, target.y),
				direction: null,
				otherDirection: null,
				failedDirections: new Set(),
			};
		}
	}

	doMove() {
		if(this.#lastSuccessfulHit) {
			let nextTile = this.#findNextTile();
			if(nextTile) {
				this.#gameboard.receiveAttack(this.#enemyTeam, nextTile.x, nextTile.y);
			}
			else {
				this.#lastSuccessfulHit = null;
				this.#attackRandomTile();
			}
		}
		else {
			this.#attackRandomTile();
		}
	}

};
