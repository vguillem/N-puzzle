type Puzzle = number[][];

type Move = "up" | "down" | "left" | "right";

interface sNode {
  id: string;
  puzzle: Puzzle;
  path: Move[];
  x: number;
  y: number;
  heuristic: number;
  level: number;
	total: number;
}

type Pool = { [id in string]: sNode };

interface State {
  node: Node;
  currentLevel: number;
}

type Heuristic = (puzzle: Puzzle) => number;
