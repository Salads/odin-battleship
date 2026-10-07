import { Pos } from "./Pos.js";
import { Direction } from "./Direction.js";

const posDeltas = Object.freeze({
	[Direction.Up]   : Object.freeze(new Pos(0, -1)),
	[Direction.Right]: Object.freeze(new Pos(1, 0)),
	[Direction.Down] : Object.freeze(new Pos(0, 1)),
	[Direction.Left] : Object.freeze(new Pos(-1, 0))
});

const directionArr = Object.values(Direction);

const HuntState = Object.freeze({
	Explore: "Explore",
	FirstDirection: "Dir1",
	SecondDirection: "Dir2"
});

const HuntResult = Object.freeze({
	Success: "AttackTaken", 
	Fallthrough: "NoAttackTaken",
	Failed: "NoPossibleAction"
});

export class Bot {

	#gameboard;
	#team;
	#enemyTeam;
	#hunt = null;

	constructor(enemyGameboard, botTeam) {
		this.#gameboard = enemyGameboard;
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

	/*
		Four phases.
			1. Find a valid direction to hunt.
			2. Keep hunting in that direction, as long as tile is un-hit and results in hit.
			3. Hunt in opposite direction, same as 2.
			4. Done.
	*/
	#huntShip() {
		if(!this.#hunt) { throw new Error("#huntShip called with no hunt obj"); }
		let hunt = this.#hunt;

		if(hunt.state === HuntState.Explore) {

			// Try every direction, until we find a un-hit tile.
			// If ship exists, set the "axis", if not, try next direction.
			for(let dirIdx = hunt.dirIdx; dirIdx < directionArr.length; dirIdx++) {
				let curDirection = directionArr[dirIdx];
				let dp = posDeltas[curDirection];
				let p2 = new Pos(hunt.startingPos.x + dp.x, hunt.startingPos.y + dp.y);
				if(p2.isValid(0, 9) && !this.#gameboard.getTileHitForTeam(this.#enemyTeam, p2.y, p2.x)) {
					
					if(this.#gameboard.receiveAttack(this.#enemyTeam, p2.x, p2.y)) {
						hunt.dirIdx = dirIdx;
						hunt.currentPos.set(p2.x, p2.y);
						hunt.otherDirection = this.#getOppositeDirection(curDirection);
						hunt.state = HuntState.FirstDirection;
					}
					else {
						hunt.dirIdx = dirIdx + 1;
					}

					return HuntResult.Success;
				}
			}

			// Could not find valid direction.
			this.#hunt = null;
			return HuntResult.Failed;
		}
		else {
			let currentDirection = directionArr[hunt.dirIdx];
			if(hunt.state === HuntState.SecondDirection) {
				currentDirection = hunt.otherDirection;
			}

			let dp = posDeltas[currentDirection];
			let p2 = new Pos(hunt.currentPos.x + dp.x, hunt.currentPos.y + dp.y);
			if(p2.isValid(0, 9) && !this.#gameboard.getTileHitForTeam(this.#enemyTeam, p2.y, p2.x)) {
				
				if(this.#gameboard.receiveAttack(this.#enemyTeam, p2.x, p2.y)) {
					hunt.currentPos.set(p2.x, p2.y);
				}
				else {
					hunt.currentPos.set(hunt.startingPos.x, hunt.startingPos.y);

					if(hunt.state === HuntState.FirstDirection) {
						hunt.state = HuntState.SecondDirection;
					}
					else {
						this.#hunt = null;
					}
				}

				return HuntResult.Success;
			}
			else {
				hunt.currentPos.set(hunt.startingPos.x, hunt.startingPos.y);
				if(hunt.state === HuntState.FirstDirection) {
					hunt.state = HuntState.SecondDirection;
					return HuntResult.Fallthrough;
				}
				else {
					this.#hunt = null;
				}

				return HuntResult.Failed;
			}
		}
	}

	#attackRandomTile() {
		// Get all tiles and pick one randomly.
		let targets = this.#gameboard.getTileTargetsForTeam(this.#enemyTeam);
		if(!targets.length) { return; }
		
		let randIdx = Math.floor(Math.random() * targets.length);
		let target = targets[randIdx];
		let hit = this.#gameboard.receiveAttack(this.#enemyTeam, target.x, target.y);

		if(hit) {
			this.#hunt = { 
				startingPos: new Pos(target.x, target.y),
				currentPos: new Pos(target.x, target.y),
				state: HuntState.Explore,
				dirIdx: 0,
				otherDirection: null,
			};
		}
	}

	doMove() {
		if(!this.#hunt) { this.#attackRandomTile(); return; }
		let huntResult = this.#huntShip();
		if(huntResult === HuntResult.Fallthrough) { huntResult = this.#huntShip(); }
		if(huntResult === HuntResult.Failed)      { this.#attackRandomTile(); }
	}

};
