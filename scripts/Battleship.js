import { DOMInterface } from "./DOMInterface.js";
import { Gameboard } from "./Gameboard.js";
import { Bot } from "./Bot.js";

const GameState = Object.freeze({
	NotStarted: 1,
	Setup: 2,
	Started: 3,
	Finished: 4,
});

const GameType = Object.freeze({
	PvP: 1,
	PvE: 2
});

export class Battleship {
	#dom = new DOMInterface();
	#gameboard = new Gameboard();
	#gameType = GameType.PvP;
	#gameState = GameState.NotStarted;
	#bot = null;

	#curTeam = 1;

	constructor() {
		this.#bot = new Bot(this.#gameboard, 2);
		this.#dom.hook("ShipPlaced", (e) => this.#onShipPlaced(e));
		this.#dom.hook("PlayCellClick", (e) => this.#onPlayCellClick(e));

		this.#dom.hook("StartPvP", (e) => this.#onStartPvP(e));
		this.#dom.hook("StartPvE", (e) => this.#onStartPvE(e));

		this.#dom.hook("SetupFinished", (e) => this.#onSetupFinished(e));

		this.#dom.setScreenToStart();
	}

	// #region Start Screen Events

	#onStartPvP() {
		this.#gameType = GameType.PvP;
		this.#gameState = GameState.Setup;
		this.#dom.setScreenToSetup(this.#curTeam);
	}

	#onStartPvE() {
		this.#gameType = GameType.PvE;
		this.#gameState = GameState.Setup;
		this.#dom.setScreenToSetup(this.#curTeam);
	}

	// #endregion

	// #region Setup Screen Events

	#onSetupFinished(e) {
		if(e.team === 1) {
			if(this.#gameType === GameType.PvE) {
				let ships = this.#bot.generateShips();
			}
			else {
				this.#dom.setScreenToSetup(2);
			}
		}
		else {
			this.#dom.setScreenToPlay(
				1, 
				this.#gameboard.getMissCountForTeam(1), 
				this.#gameboard.getHitCountForTeam(1), 
				this.#gameboard.getShipsForTeam(1)
			);
		}
	}

	#onShipPlaced(e) {
		let success = this.#gameboard.addShip(
			e.team,
			e.shipType,
			e.col, e.row,
			e.faceDirection
		);

		// TODO(Salads): Validate drops from DOM side.
		if(!success) { throw new Error("Invalid Ship Placement"); }
		this.#dom.addSetupShip(e.shipType, e.row, e.col, e.faceDirection);
	}

	// #endregion

	#onPlayCellClick(e) {
		let hit = this.#gameboard.receiveAttack(this.getEnemyTeam(e.team), e.col, e.row);
		this.#dom.setAttackTileHit(e.row, e.col, hit);
		this.#dom.setPlayStats(
			this.#gameboard.getMissCountForTeam(e.team), 
			this.#gameboard.getHitCountForTeam(e.team))
	}

	getEnemyTeam(team) {
		if(team === 1) { return 2; }
		else if(team === 2) { return 1; }
		else { return 0; }
	}

	cycleTurn() {
		if(this.#curTeam === 1) {
			this.#curTeam = 2;
		}
		else {
			this.#curTeam = 1;
		}
	}
};