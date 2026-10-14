const Direction = {
	Up: "Up",
	Right: "Right",
	Down: "Down",
	Left: "Left",
};

Direction.AsArray = Object.freeze([
	Direction.Up,
	Direction.Right,
	Direction.Down,
	Direction.Left,
]);

Direction.getOppositeDirection = Object.freeze((direction) => {
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
});

Object.freeze(Direction);

export { Direction };