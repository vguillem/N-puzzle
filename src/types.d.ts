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

type heuristics = 'inversion' | 'linearConflict' | 'manhattan';
type Heuristic = (puzzle: Puzzle) => number;

type algorithms = 'astar' | 'idastar';

type searchStyle = 'greedy' | 'uniform';

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
  numNodes: number;
  allNumNodes: number[];
  maxNumNodes: number;
  allMaxNumNodes: number[];
  path: Move[];
}

type PerNum = { [num: number]: number };
