import { Direction } from "./Direction.js";

function getCellConfig(shipType, startRow, startCol, row, col, faceDir) {
	if(faceDir === Direction.Up) {
		return {
			texture: `url(${shipType.texture})`,
			tileClass: `tile${row - startRow + 1}`,
			rotateClass: `tileRotation${faceDir}`
		};
	}
	else if(faceDir === Direction.Right) {
		return {
			texture: `url(${shipType.texture})`,
			tileClass: `tile${startCol - col + 1}`,
			rotateClass: `tileRotation${faceDir}`
		};
	}
	else if(faceDir === Direction.Down) {
		return {
			texture: `url(${shipType.texture})`,
			tileClass: `tile${startRow - row + 1}`,
			rotateClass: `tileRotation${faceDir}`
		};
	}
	else if(faceDir === Direction.Left) {
		return {
			texture: `url(${shipType.texture})`,
			tileClass: `tile${col - startCol + 1}`,
			rotateClass: `tileRotation${faceDir}`
		};
	}
	else {
		throw new Error("Invalid direction");
	}
}

function addShip(gridCells, shipType, startRow, startCol, faceDir) {
	let size = shipType.size;
	if(faceDir === Direction.Up) {
		let endRow = startRow + (size - 1);
		for(let row = startRow; row <= endRow; row++){
			let cell = gridCells[row][startCol];
			let config = getCellConfig(shipType, startRow, startCol, row, startCol, faceDir);
			cell.style.setProperty('--ship-texture', config.texture);
			cell.classList.add(config.tileClass);
			cell.classList.add(config.rotateClass);
		}
	}
	else if(faceDir === Direction.Right) {
		let endCol = startCol - (size - 1);
		for(let col = startCol; col >= endCol; col--){
			let cell = gridCells[startRow][col];
			let config = getCellConfig(shipType, startRow, startCol, startRow, col, faceDir);
			cell.style.setProperty('--ship-texture', config.texture);
			cell.classList.add(config.tileClass);
			cell.classList.add(config.rotateClass);
		}
	}
	else if(faceDir === Direction.Down) {
		let endRow = startRow - (size - 1);
		for(let row = startRow; row >= endRow; row--){
			let cell = gridCells[row][startCol];
			let config = getCellConfig(shipType, startRow, startCol, row, startCol, faceDir);
			cell.style.setProperty('--ship-texture', config.texture);
			cell.classList.add(config.tileClass);
			cell.classList.add(config.rotateClass);
		}
	}
	else if(faceDir === Direction.Left) {
		let endCol = startCol + (size - 1);
		for(let col = startCol; col <= endCol; col++){
			let cell = gridCells[startRow][col];
			let config = getCellConfig(shipType, startRow, startCol, startRow, col, faceDir);
			cell.style.setProperty('--ship-texture', config.texture);
			cell.classList.add(config.tileClass);
			cell.classList.add(config.rotateClass);
		}
	}
}

export { addShip, getCellConfig };