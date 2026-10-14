import { test, expect } from "@jest/globals";
import { Team } from "../scripts/Team.js";

test("Team - isFrozen & Member Values", () => {
	expect(Team.Team1).toBe(1);
	expect(Team.Team2).toBe(2);

	expect(Object.isFrozen(Team)).toBe(true);
	expect(Object.isFrozen(Team.getEnemyTeam)).toBe(true);
});

test("Team - getEnemyTeam(1)", () => {
	let r = Team.getEnemyTeam(1);
	expect(r).toBe(2);
});

test("Team - getEnemyTeam(2)", () => {
	let r = Team.getEnemyTeam(2);
	expect(r).toBe(1);
});

test("Team - getEnemyTeam(throwing val)", () => {
	expect(() => Team.getEnemyTeam(3)).toThrow();
});