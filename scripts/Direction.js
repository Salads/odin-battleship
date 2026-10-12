const Direction = {
	Up: "Up",
	Right: "Right",
	Down: "Down",
	Left: "Left",
};

Direction.AsArray = Object.freeze([
	Direction.Up,
	Direction.Left,
	Direction.Down,
	Direction.Right,
]);

Object.freeze(Direction);

export { Direction };