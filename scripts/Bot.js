import { Pos } from "./Pos.js";
import { Direction } from "./Direction.js";
import { ShipType } from "./ShipType.js";
import { Team } from "./Team.js";
import { validateShipPlacement } from "./ShipValidation.js";

const posDeltas = Object.freeze({
	[Direction.Up]   : Object.freeze(new Pos(-1, 0)),
	[Direction.Right]: Object.freeze(new Pos(0, 1)),
	[Direction.Down] : Object.freeze(new Pos(1, 0)),
	[Direction.Left] : Object.freeze(new Pos(0, -1))
});

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

	#botState;
	#enemyState;
	#team;
	#enemyTeam;
	#hunt = null;

	constructor(botState, enemyState) {
		this.#botState = botState;
		this.#enemyState = enemyState;
		this.#team = botState.team;
		this.#enemyTeam = Team.getEnemyTeam(this.#team);
	}

	get team() {
		return this.#team;
	}

	placeShips() {	
		for(let shipType of ShipType.AsArray) {
			let foundPlacement = false;
			while(!foundPlacement) {
				let randRow = Math.floor(Math.random() * 10);
				let randCol = Math.floor(Math.random() * 10);
				
				for(let faceDir of Direction.AsArray) {
					let valid = validateShipPlacement(
						this.#botState.board, shipType, randRow, randCol, faceDir);
					
					if(valid) {
						this.#botState.addShip(shipType, randRow, randCol, faceDir);
						foundPlacement = true;
						break;
					}
				}
			}
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
			for(let dirIdx = hunt.dirIdx; dirIdx < Direction.AsArray.length; dirIdx++) {
				let curDirection = Direction.AsArray[dirIdx];
				let dp = posDeltas[curDirection];
				let p2 = new Pos(hunt.startingPos.row + dp.row, hunt.startingPos.col + dp.col);
				if(p2.isValid(0, 9) && !this.#enemyState.board[p2.row][p2.col].hit) {
					
					if(this.#enemyState.receiveAttack(p2.row, p2.col)) {
						hunt.dirIdx = dirIdx;
						hunt.currentPos.set(p2.row, p2.col);
						hunt.otherDirection = Direction.getOppositeDirection(curDirection);
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
			let currentDirection = Direction.AsArray[hunt.dirIdx];
			if(hunt.state === HuntState.SecondDirection) {
				currentDirection = hunt.otherDirection;
			}

			let dp = posDeltas[currentDirection];
			let p2 = new Pos(hunt.currentPos.row + dp.row, hunt.currentPos.col + dp.col);
			if(p2.isValid(0, 9) && !this.#enemyState.board[p2.row][p2.col].hit) {
				
				if(this.#enemyState.receiveAttack(p2.row, p2.col)) {
					hunt.currentPos.set(p2.row, p2.col);
				}
				else {
					hunt.currentPos.set(hunt.startingPos.row, hunt.startingPos.col);

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
				hunt.currentPos.set(hunt.startingPos.row, hunt.startingPos.col);
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

	#getTileTargets() {
		let result = [];

		for(let row = 0; row < 10; row++){
			for(let col = 0; col < 10; col++) {
				let tile = this.#enemyState.board[row][col];
				if(!tile.hit) {
					result.push({row, col});
				}
			}
		}

		return result;
	}

	#attackRandomTile() {
		// Get all tiles and pick one randomly.
		let targets = this.#getTileTargets();
		if(!targets.length) { return; }
		
		let randIdx = Math.floor(Math.random() * targets.length);
		let target = targets[randIdx];
		let hit = this.#enemyState.receiveAttack(target.row, target.col);

		if(hit) {
			this.#hunt = { 
				startingPos: new Pos(target.row, target.col),
				currentPos: new Pos(target.row, target.col),
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
