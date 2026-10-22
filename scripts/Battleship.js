import { DOMStartSection } from "./DOMStartSection.js";
import { DOMSetupSection } from "./DOMSetupSection.js";
import { DOMPlaySection } from "./DOMPlaySection.js";
import { DOMFinishSection } from "./DOMFinishSection.js";
import { Bot } from "./Bot.js";
import { Team } from "./Team.js";
import { PlayerState } from "./PlayerState.js";
import { DOMHideSection } from "./DOMHideSection.js";

const GameType = Object.freeze({
	PvP: 1,
	PvE: 2
});

const GameState = Object.freeze({
	Start : 1,
	Setup : 2,
	Play  : 3,
	Finish: 4
});

export class Battleship {
	#domStart = new DOMStartSection();
	#domSetup = new DOMSetupSection();
	#domPlay = new DOMPlaySection();
	#domFinish = new DOMFinishSection();
	#domHide = new DOMHideSection();

	#p1State = new PlayerState(1);
	#p2State = new PlayerState(2);
	#gameType = GameType.PvP;
	#bot = null;

	#curTeam = 1;
	#gameState = GameState.Start;

	constructor() {
		this.#domStart.hook("StartPvP", (e) => this.#onPVPClick(e));
		this.#domStart.hook("StartPvE", (e) => this.#onPVEClick(e));

		this.#domSetup.hook("SetupShipPlaced", (e) => this.#onShipPlaced(e));
		this.#domSetup.hook("SetupFinished", (e) => this.#onSetupFinished(e));

		this.#domPlay.hook("PlayCellClick", (e) => this.#onPlayCellClick(e));

		this.#domFinish.hook("FinishContinue", (e) => this.#onFinishContinue(e));
		this.#domHide.hook("HideContinue", (e) => this.#onPVPHideContinue(e));

		this.showStartSection();
	}

	getTeamState(team) {
		if(team === 1) {
			return this.#p1State;
		}
		else if(team === 2) {
			return this.#p2State;
		}
		else {
			throw new Error("Invalid team");
		}
	}

	getWinningTeam() {
		if(!this.#p1State.shipsRemaining) {
			return 2;
		}
		else if(!this.#p2State.shipsRemaining) {
			return 1;
		}
		else {
			return 0;
		}
	}

	// #region GameState Mutating Events

	// #region Start Screen Events

	#onPVPClick() {
		this.#curTeam = 1;
		this.#gameType = GameType.PvP;
		this.#gameState = GameState.Setup;
		this.showSetupSection(this.#curTeam);
	}

	#onPVEClick() {
		this.#curTeam = 1;
		this.#gameType = GameType.PvE;
		this.#gameState = GameState.Setup;
		this.showSetupSection(this.#curTeam);
		this.#bot = new Bot(this.#p2State, this.#p1State);
	}

	// #endregion

	// #region Setup Screen Events

	#onSetupFinished(e) {
		if(this.#gameType === GameType.PvP) {
			if(this.#curTeam === 2) {
				this.#gameState = GameState.Play;
			}

			this.showHideSection(this.#curTeam);
		}
		else if(this.#gameType === GameType.PvE) {
			this.#bot.placeShips();
			this.showPlaySection(this.#p1State, this.#p2State);
		}
	}

	// #endregion

	#onPlayCellClick(e) {
		let playerState = this.getTeamState(this.#curTeam);
		let enemyState = this.getTeamState(Team.getEnemyTeam(this.#curTeam));

		let hit = playerState.attack(enemyState, e.row, e.col);
		this.#domPlay.setAttackTileHit(e.row, e.col, hit);
		this.#domPlay.setPlayStats(playerState.missCount, playerState.hitCount);

		let winningTeam = this.getWinningTeam();
		if(winningTeam > 0) {
			this.showFinishSection(winningTeam);
			return;
		}

		if(this.#gameType === GameType.PvE) {
			this.#bot.doMove();
			this.showPlaySection(playerState, enemyState);
		}
		else {
			this.showHideSection(this.#curTeam);
		}
	}

	#onPVPHideContinue() {
		this.#curTeam = Team.getEnemyTeam(this.#curTeam);
		if(this.#gameState === GameState.Setup) {
			this.showSetupSection(this.#curTeam);
		}
		else if(this.#gameState === GameState.Play) {
			const playerState = this.getTeamState(this.#curTeam);
			const enemyState = this.getTeamState(Team.getEnemyTeam(this.#curTeam));
			this.showPlaySection(playerState, enemyState);
		}
	}

	#onFinishContinue(e) {
		this.#p1State.reset();
		this.#p2State.reset();
		this.#curTeam = 1;
		this.showStartSection();
	}

	// #endregion

	// #region Section Changers
	showStartSection() {
		this.#domStart.show();
		this.#domSetup.hide();
		this.#domPlay.hide();
		this.#domFinish.hide();
		this.#domHide.hide();
	}

	showSetupSection(forTeam) {
		this.#curTeam = forTeam;
		this.#domStart.hide();
		this.#domSetup.show(forTeam);
		this.#domPlay.hide();
		this.#domFinish.hide();
		this.#domHide.hide();
	}

	showPlaySection(playerState, enemyState) {
		this.#curTeam = playerState.team;
		this.#domStart.hide();
		this.#domSetup.hide();
		this.#domPlay.show(playerState, enemyState);
		this.#domFinish.hide();
		this.#domHide.hide();
	}

	showFinishSection(forTeam) {
		this.#curTeam = forTeam;
		this.#domStart.hide();
		this.#domSetup.hide();
		this.#domPlay.hide();
		this.#domFinish.show(forTeam);
		this.#domHide.hide();
	}

	showHideSection(forTeam) {
		this.#curTeam = forTeam;
		this.#domStart.hide();
		this.#domSetup.hide();
		this.#domPlay.hide();
		this.#domFinish.hide();
		this.#domHide.show(forTeam);
	}
	// #endregion

	// #region Setup Screen Events

	#onShipPlaced(e) {

		const playerState = this.getTeamState(this.#curTeam);
		let success = playerState.addShip(
			e.shipType,
			e.row, e.col,
			e.faceDirection
		);

		if(!success) { throw new Error("Invalid Ship Placement"); }
		this.#domSetup.addSetupShip(e.shipType, e.row, e.col, e.faceDirection);
	}

	// #endregion

};