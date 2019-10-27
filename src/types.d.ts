type Puzzle = number[][];

type Move = 'up' | 'down' | 'left' | 'right';

interface sNode {
		parent: sNode | null;
		puzzle: Puzzle;
		path: Move[];
		x: number;
		y: number;
		heuristic: number;
		level: number;
}

interface State {
	node: Node;
	currentLevel: number;
}

type Heuristic = (puzzle: Puzzle) => number;

