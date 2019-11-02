type WrongMove = {
  [move in Move]: (x: number, y: number, length: number) => boolean;
};

export const wrongMove: WrongMove = {
  left: x => !x,
  right: (x, _, length) => x === length - 1,
  up: (_, y) => !y,
  down: (_, y, length) => y === length - 1
};

type Switcher = {
  [move in Move]: (
    puzzle: Puzzle,
    prevX: number,
    prevY: number
  ) => [number, number];
};

export const switcher: Switcher = {
  left: (puzzle: Puzzle, prevX: number, prevY: number) => {
    const newX = prevX - 1;
    puzzle[prevY][prevX] = puzzle[prevY][newX];
    puzzle[prevY][newX] = 0;
    return [newX, prevY];
  },
  right: (puzzle: Puzzle, prevX: number, prevY: number) => {
    const newX = prevX + 1;
    puzzle[prevY][prevX] = puzzle[prevY][newX];
    puzzle[prevY][newX] = 0;
    return [newX, prevY];
  },
  up: (puzzle: Puzzle, prevX: number, prevY: number) => {
    const newY = prevY - 1;
    puzzle[prevY][prevX] = puzzle[newY][prevX];
    puzzle[newY][prevX] = 0;
    return [prevX, newY];
  },
  down: (puzzle: Puzzle, prevX: number, prevY: number) => {
    const newY = prevY + 1;
    puzzle[prevY][prevX] = puzzle[newY][prevX];
    puzzle[newY][prevX] = 0;
    return [prevX, newY];
  }
};

export const badMoves = new Set([
  'left|right',
  'right|left',
  'up|down',
  'down|up'
]);

export const getCreateNode = (heuristic: Heuristic) => (
  puzzle: Puzzle,
  x: number,
  y: number,
  prevPath: Move[],
  prevLevel: number,
  move?: Move
): sNode => {
  const h = heuristic(puzzle);
  const newPath = prevPath.slice();
  const newLevel = prevLevel + 1;
  if (move) newPath.push(move);
  return {
    id: puzzle.flat().join('|'),
    heuristic: h,
    total: h + newLevel,
    path: newPath,
    level: newLevel,
    puzzle,
    x,
    y
  };
};

export const findEmptyBlock = (puzzle: Puzzle) => {
  for (let y = 0; y < puzzle.length; y++) {
    const x = puzzle[y].indexOf(0);
    if (x !== -1) return [x, y];
  }
  return [];
};

export const getMinFromPool = (pool: { [x: number]: sNode[] }) => {
  let minKey = Infinity;
  for (const key in pool) {
    if (+key < minKey) minKey = +key;
  }
  return minKey;
};
