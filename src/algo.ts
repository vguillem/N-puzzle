interface Props {
  puzzle: Puzzle;
  heuristic: Heuristic;
}

export const solve = ({ puzzle, heuristic }: Props) => {
  const [x, y] = findEmptyBlock(puzzle);
  const firstNode = generateFirstNode(heuristic)(puzzle, x, y);
  console.log(x, y, firstNode);
};

const generateFirstNode = (heuristic: Heuristic) => (
  puzzle: Puzzle,
  x: number,
  y: number
): sNode => ({
  heuristic: heuristic(puzzle),
  parent: null,
  path: [],
  level: 0,
  puzzle,
  x,
  y
});

const findEmptyBlock = (puzzle: Puzzle) => {
  for (let y = 0; y < puzzle.length; y++) {
    const x = puzzle[y].indexOf(0);
    if (x !== -1) {
      return [x, y];
    }
  }
  return [];
};

