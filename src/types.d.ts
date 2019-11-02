type Puzzle = number[][];

type Move = 'up' | 'down' | 'left' | 'right';

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

type Heuristic = (puzzle: Puzzle) => number;

interface State {
  manhattan: HeuristicState;
  linearConflict: HeuristicState;
  inversion: HeuristicState;
}

interface HeuristicState {
  createdNodes: number;
  allCreatedNodes: number[];
  solveTime: number;
  allSolvedTimes: number[];
}

type PerNum = { [num: number]: number };
