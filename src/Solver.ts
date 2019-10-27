let victoriousNode: node | null = null;

export const solve = (puzzle: Puzzle) => {
  const [x, y] = findEmptyBlock(puzzle);
  const firstNode = generateFirstNode(puzzle, x, y);
  aStar(firstNode);
  console.log(victoriousNode);
};

const generateFirstNode = (puzzle: Puzzle, x: number, y: number) => ({
  path: [] as Move[],
  parent: null,
  x,
  y,
  children: [] as node[],
  puzzle,
  heuristic: manhattanHeuristic(puzzle),
  level: 0
});

const aStar = (node: node) => {
  node.children = getChildren(node);
  if (
    !victoriousNode &&
    node.children.length &&
    node.heuristic &&
    node.level < 2000
  ) {
    node.children
      .sort((a, b) => b.heuristic - a.heuristic)
			.forEach(node => aStar(node));
  }
	if (!node.heuristic) console.log(node);
  if (!victoriousNode && !node.heuristic) victoriousNode = node;
};

const getChildren = (node: node): node[] => {
  const lastMove: Move | undefined = node.path.pop();
  const moves = (["up", "left", "right", "down"] as Move[]).filter(
    filterMoves(node.x, node.y, node.puzzle.length, lastMove)
  );
  return moves.map(move => {
    const { puzzle, x, y } = getNewPuzzle[move](node.puzzle, node.x, node.y);
    const newPath = node.path.map(d => d);
    newPath.push(move);
    return {
      path: newPath,
      parent: node,
      level: node.level + 1,
      heuristic: manhattanHeuristic(puzzle),
      children: [] as node[],
      puzzle,
      x,
      y
    } as node;
  });
};

const BAD_PATTERNS = new Set(["up|down", "left|right"]);

const filterMoves = (x: number, y: number, length: number, lastMove?: Move) => (
  move: Move
) => {
  const wrongPattern =
    BAD_PATTERNS.has(`${lastMove}|${move}`) ||
    BAD_PATTERNS.has(`${move}|${lastMove}`);
  return filterFunctions[move](x, y, length) && (!lastMove || !wrongPattern);
};

const filterFunctions: {
  [move in Move]: (x: number, y: number, length: number) => boolean;
} = {
  up: (_: number, y: number, __: number) => y !== 0,
  down: (_: number, y: number, length: number) => y !== length - 1,
  left: (x: number, _: number, __: number) => x !== 0,
  right: (x: number, _: number, length: number) => x !== length - 1
};

const getNewPuzzle = {
  up: (puzzle: Puzzle, x: number, y: number) => {
    const newPuzzle = puzzle.map(row => row.map(line => line));
    newPuzzle[y][x] = puzzle[y - 1][x];
    newPuzzle[y - 1][x] = 0;
    return { x, y: y - 1, puzzle: newPuzzle };
  },
  down: (puzzle: Puzzle, x: number, y: number) => {
    const newPuzzle = puzzle.map(row => row.map(line => line));
    newPuzzle[y][x] = puzzle[y + 1][x];
    newPuzzle[y + 1][x] = 0;
    return { x, y: y + 1, puzzle: newPuzzle };
  },
  left: (puzzle: Puzzle, x: number, y: number) => {
    const newPuzzle = puzzle.map(row => row.map(line => line));
    newPuzzle[y][x] = puzzle[y][x - 1];
    newPuzzle[y][x - 1] = 0;
    return { x: x - 1, y, puzzle: newPuzzle };
  },
  right: (puzzle: Puzzle, x: number, y: number) => {
    const newPuzzle = puzzle.map(row => row.map(line => line));
    newPuzzle[y][x] = puzzle[y][x + 1];
    newPuzzle[y][x + 1] = 0;
    return { x: x + 1, y, puzzle: newPuzzle };
  }
};

const findEmptyBlock = (puzzle: Puzzle) => {
  for (let y = 0; y < puzzle.length; y++) {
    const x = puzzle[y].indexOf(0);
    if (x !== -1) {
      return [x, y];
    }
  }
  return [];
};
