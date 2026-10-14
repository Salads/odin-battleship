import { Ship } from "./Ship.js";
import { Direction } from "./Direction.js";

function validateShipPlacement(playerBoard, shipType, startRow, startCol, faceDir) {
	let tempShip = new Ship(shipType, startRow, startCol, faceDir);
	let range = tempShip.getRange();

	if(!range.isValid(0, 9)) {
		return false;
	}

	if(tempShip.direction === Direction.Left || tempShip.direction === Direction.Right) {
		for(let col = range.start; col <= range.end; col++) {
			if(playerBoard[startRow][col].ship) {
				return false;
			}
		}
	}
	else if(tempShip.direction === Direction.Up || tempShip.direction === Direction.Down) {
		for(let row = range.start; row <= range.end; row++) {
			if(playerBoard[row][startCol].ship) {
				return false;
			}
		}
	}

	return true;
}

export { validateShipPlacement };