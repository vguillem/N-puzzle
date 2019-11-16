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

export const initNode = (
  heuristic: number,
  puzzle: Puzzle,
  x: number,
  y: number
): sNode => ({
  id: puzzle.flat().join('|'),
  path: [],
  total: heuristic,
  level: 0,
  heuristic,
  puzzle,
  x,
  y
});

export const getCreateNode: {
  [search in searchStyle]: (
    h: Heuristic
  ) => (
    puzzle: Puzzle,
    x: number,
    y: number,
    prevPath: Move[],
    move: Move,
    prevLevel: number
  ) => sNode;
} = {
  greedy: heuristic => (puzzle, x, y, prevPath, move) => {
    const h = heuristic(puzzle);
    const newPath = prevPath.slice();
    newPath.push(move);
    return {
      id: puzzle.flat().join('|'),
      heuristic: h,
      level: 0,
      total: 0,
      path: newPath,
      puzzle,
      x,
      y
    };
  },
  uniform: _ => (puzzle, x, y, prevPath, move, prevLevel) => {
    const newPath = prevPath.slice();
    newPath.push(move);
    return {
      id: puzzle.flat().join('|'),
      heuristic: 0,
      level: prevLevel + 1,
      total: 0,
      path: newPath,
      puzzle,
      x,
      y
    };
  },
  normal: heuristic => (puzzle, x, y, prevPath, move, prevLevel) => {
    const h = heuristic(puzzle);
    const newPath = prevPath.slice();
    newPath.push(move);
    return {
      id: puzzle.flat().join('|'),
      heuristic: h,
      level: prevLevel + 1,
      total: h + prevLevel + 1,
      path: newPath,
      puzzle,
      x,
      y
    };
  }
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

export class Queue {
  pool: { [value: number]: sNode[] };
  getValue: (node: sNode) => number;
  getPlacementValue: (node: sNode) => number;
  smallestPool: number;

  public constructor(firstNode: sNode, search: searchStyle) {
    this.getValue = getGetter[search];
    this.getPlacementValue = getPlacementGetter[search];
    this.pool = { [this.getValue(firstNode)]: [firstNode] };
    this.smallestPool = this.getValue(firstNode);
  }

  public pop(): sNode {
    const node = this.pool[this.smallestPool].pop() as sNode;
    if (!this.pool[this.smallestPool].length)
      this.smallestPool = getMinFromPool(this.pool);
    return node;
  }

  public insert(node: sNode) {
    const value = this.getValue(node);
    this.smallestPool = Math.min(this.smallestPool, value);
    if (!this.pool[value]) {
      this.pool[value] = [node];
    } else {
      const index = this.findNodeIndex(
        this.pool[value],
        this.getPlacementValue(node)
      );
      this.pool[value].splice(index, 0, node);
    }
  }

  private findNodeIndex(stack: sNode[], value: number) {
    let i;
    for (i = stack.length - 1; i > 0; i--)
      if (this.getPlacementValue(stack[i]) > value) return i;
    return i;
  }
}

export const getGetter = {
  normal: (node: sNode) => node.total,
  greedy: (node: sNode) => node.heuristic,
  uniform: (node: sNode) => node.level
};

const getPlacementGetter = {
  normal: (node: sNode) => node.heuristic,
  greedy: (node: sNode) => node.heuristic,
  uniform: (node: sNode) => node.level
};
