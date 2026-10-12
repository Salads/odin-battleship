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

Object.freeze(Direction);

export { Direction };