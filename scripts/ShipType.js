
const ShipType = Object.freeze({
	Carrier:    Object.freeze({ size: 5, name: "Carrier"     }),
	Battleship: Object.freeze({ size: 4, name: "Battleship"  }),
	Destroyer:  Object.freeze({ size: 3, name: "Destroyer"   }),
	Submarine:  Object.freeze({ size: 3, name: "Submarine"   }),
	PatrolBoat: Object.freeze({ size: 2, name: "Patrol Boat" })
});

export { ShipType };