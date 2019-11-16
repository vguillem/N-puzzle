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

interface AlgorithmData {
  solveTime: number;
  createdNodes: number;
  numNodes: number;
  maxNumNodes: number;
  node: sNode;
  algorithm: algorithms;
  heuristic: heuristics;
  search: searchStyle;
}

type Pool = { [id in string]: sNode };

type heuristics =
  | 'hamming'
  | 'linearConflict'
  | 'manhattan'
  | 'cornerTile'
  | 'combined';

type Heuristic = (puzzle: Puzzle) => number;

type algorithms = 'astar' | 'idastar';

type searchStyle = 'normal' | 'greedy' | 'uniform';

type State = {
  [heuristic in heuristics]: HeuristicState;
};

interface HeuristicState {
  createdNodes: number;
  allCreatedNodes: number[];
  solveTime: number;
  allSolvedTimes: number[];
  nbStudiedNodes: number;
  allNbStudiedNodes: number[];
  maxNumNodes: number;
  allMaxNumNodes: number[];
  path: Move[];
  steps?: Puzzle[];
}

type PerNum = { [num: number]: number };
