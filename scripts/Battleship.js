import { DOMStartSection } from "./DOMStartSection.js";
import { DOMSetupSection } from "./DOMSetupSection.js";
import { DOMPlaySection } from "./DOMPlaySection.js";
import { DOMFinishSection } from "./DOMFinishSection.js";
import { Bot } from "./Bot.js";
import { Team } from "./Team.js";
import { PlayerState } from "./PlayerState.js";

const GameType = Object.freeze({
	PvP: 1,
	PvE: 2
});

export class Battleship {
	#domStart = new DOMStartSection();
	#domSetup = new DOMSetupSection();
	#domPlay = new DOMPlaySection();
	#domFinish = new DOMFinishSection();

	#p1State = new PlayerState(1);
	#p2State = new PlayerState(2);
	#gameType = GameType.PvP;
	#bot = null;

	#curTeam = 1;

	constructor() {
		this.#domStart.hook("StartPvP", (e) => this.#onStartPvP(e));
		this.#domStart.hook("StartPvE", (e) => this.#onStartPvE(e));

		this.#domSetup.hook("SetupShipPlaced", (e) => this.#onShipPlaced(e));
		this.#domSetup.hook("SetupFinished", (e) => this.#onSetupFinished(e));

		this.#domPlay.hook("PlayCellClick", (e) => this.#onPlayCellClick(e));

		this.#domFinish.hook("FinishContinue", (e) => this.#onFinishContinue(e));

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

	// #region Section Changers
	showStartSection() {
		this.#domStart.show();
		this.#domSetup.hide();
		this.#domPlay.hide();
		this.#domFinish.hide();
	}

	showSetupSection(forTeam) {
		this.#curTeam = forTeam;
		this.#domStart.hide();
		this.#domSetup.show(forTeam);
		this.#domPlay.hide();
		this.#domFinish.hide();
	}

	showPlaySection(playerState, enemyState) {
		this.#curTeam = playerState.team;
		this.#domStart.hide();
		this.#domSetup.hide();
		this.#domPlay.show(playerState, enemyState);
		this.#domFinish.hide();
	}

	showFinishSection(forTeam) {
		this.#curTeam = forTeam;
		this.#domStart.hide();
		this.#domSetup.hide();
		this.#domPlay.hide();
		this.#domFinish.show(forTeam);
	}
	// #endregion

	// #region Start Screen Events

	#onStartPvP() {
		this.#curTeam = 1;
		this.#gameType = GameType.PvP;
		this.showSetupSection(this.#curTeam);
	}

	#onStartPvE() {
		this.#bot = new Bot(this.#p2State, this.#p1State);
		this.#curTeam = 1;
		this.#gameType = GameType.PvE;
		this.showSetupSection(this.#curTeam);
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

	#onSetupFinished(e) {

		let goNextScreen = false;
		if(e.team === 1) {
			if(this.#gameType === GameType.PvE) {
				const playerState = this.getTeamState(this.#curTeam);
				this.#bot.placeShips(playerState);
				goNextScreen = true;
			}
			else {
				this.showSetupSection(2);
			}
		}
		else {
			goNextScreen = true;
		}

		if(goNextScreen) {
			this.#curTeam = 1;
			const playerState = this.getTeamState(this.#curTeam);
			const enemyState = this.getTeamState(Team.getEnemyTeam(this.#curTeam));
			this.showPlaySection(playerState, enemyState);
		}
	}

	// #endregion

	// #region Play Screen Events

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
			this.#curTeam = Team.getEnemyTeam(this.#curTeam);
			this.showPlaySection(enemyState, playerState);
		}
	}

	// #endregion

	// #region Finish Screen Events

	#onFinishContinue(e) {
		this.#p1State.reset();
		this.#p2State.reset();
		this.#curTeam = 1;
		this.showStartSection();
	}

	// #endregion

};