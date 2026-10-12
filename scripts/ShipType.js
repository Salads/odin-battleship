
const ShipType = {
	Carrier: Object.freeze({ 
		texture: "/assets/carrier.png",
		size: 5, 
		displayName: "Carrier",
		refname: "carrier"
	}),

	Battleship: Object.freeze({ 
		texture: "/assets/battleship.png", 
		size: 4, 
		displayName: "Battleship",
		refname: "battleship"
	}),

	Destroyer: Object.freeze({ 
		texture: "/assets/destroyer.png", 
		size: 3, 
		displayName: "Destroyer",
		refname: "destroyer"
	}),

	Submarine: Object.freeze({ 
		texture: "/assets/submarine.png", 
		size: 3, 
		displayName: "Submarine",
		refname: "submarine"
	}),

	PatrolBoat: Object.freeze({
		texture: "/assets/patrolboat.png",
		size: 2, 
		displayName: "Patrol Boat",
		refname: "patrol_boat"
	}),

};

ShipType.AsArray = Object.freeze([
	ShipType.PatrolBoat,
	ShipType.Submarine,
	ShipType.Destroyer,
	ShipType.Battleship,
	ShipType.Carrier,
]);

ShipType.getTypeByRefName = Object.freeze((refName) => {
	for(let shipType of ShipType.AsArray) {
		if(shipType.refname === refName) {
			return shipType;
		}
	}

	return undefined;
}),

Object.freeze(ShipType);

export { ShipType };