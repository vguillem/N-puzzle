import { config } from './config';
import { logPuzzle } from './logger';

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
  let minValue = Infinity;
  for (const key in pool) {
    if (+key < minValue && pool[key].length) minValue = +key;
  }
  return minValue;
};

const clonePuzzle = (puzzle: Puzzle) => puzzle.map(line => line.slice());

const getZeroPos = (puzzle: Puzzle) => {
  for (let line = 0; line < puzzle.length; line++) {
    for (let col = 0; col < puzzle.length; col++) {
      if (puzzle[line][col] === 0) {
        return { zeroX: col, zeroY: line };
      }
    }
  }
  return { zeroX: 0, zeroY: 0 };
};

export const getAllSteps = (initialStep: Puzzle, path: Move[]) => {
  const allSteps = [initialStep];
  let { zeroX, zeroY } = getZeroPos(initialStep);
  let lastPuzzle = initialStep;

  path.forEach(move => {
    const newPuzzle = clonePuzzle(lastPuzzle);
    [zeroX, zeroY] = switcher[move](newPuzzle, zeroX, zeroY);
    allSteps.push(newPuzzle);
    lastPuzzle = newPuzzle;
  });

  allSteps.forEach(step => logPuzzle(step, config.size));

  return allSteps;
};
