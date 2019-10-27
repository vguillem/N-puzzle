type Puzzle = number[][];

type Move = 'up' | 'down' | 'left' | 'right';

interface node {
		parent: node | null;
		puzzle: Puzzle;
		x: number;
		y: number;
		heuristic: number;
		level: number;
		path: Move[];
}

interface State {
	node: Node;
	currentLevel: number;
}
