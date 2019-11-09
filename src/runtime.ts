import * as algorithms from './algo';
import { generateSolvedPuzzle, generatePuzzle } from './generatePuzzle';
import { initializeHeuristics } from './heuristics';
import { logOnce, logBench, logPuzzle } from './logger';
import { config } from './config';
import { getAllSteps } from './utils';

const generateEmptyState = () => ({
  allSolvedTimes: [],
  createdNodes: 0,
  solveTime: 0,
  allCreatedNodes: [],
  numNodes: 0,
  allNumNodes: [],
  maxNumNodes: 0,
  allMaxNumNodes: [],
  path: []
});

const state: State = {
  manhattan: generateEmptyState(),
  linearConflict: generateEmptyState(),
  hamming: generateEmptyState(),
  cornerTile: generateEmptyState(),
  combined: generateEmptyState()
};

export const runOnce = (puzzle: Puzzle) => {
  const solved = generateSolvedPuzzle(config.size);
  const heuristics = initializeHeuristics(solved, config.size);
  console.log();
  logPuzzle(puzzle, config.size);
  try {
    config.algorithms.forEach(algorithm => {
      config.heuristics.forEach(heuristic => {
        config.search.forEach(search => {
          computeOnce(
            puzzle,
            heuristics[heuristic],
            heuristic,
            algorithm,
            search
          );
          logOnce(algorithm, heuristic, search, state);
        });
      });
    });
  } catch (e) {
    console.error(e.message);
  }
};

const computeOnce = (
  puzzle: Puzzle,
  heuristic: Heuristic,
  type: heuristics,
  algorithm: algorithms,
  search: searchStyle
) => {
  const time = Date.now();
  const { node, numNodes, maxNumNodes, createdNodes } = algorithms[algorithm]({
    puzzle: puzzle,
    heuristic,
    search
  });
  const solveTime = Date.now() - time;
  if (config.showSteps) {
    state[type].steps = getAllSteps(puzzle, node.path);
  }
  state[type].solveTime = solveTime;
  state[type].createdNodes = createdNodes;
  state[type].numNodes = numNodes;
  state[type].maxNumNodes = maxNumNodes;
  state[type].path = node.path;
};

export const runBench = async () => {
  while (true) {
    const solved = generateSolvedPuzzle(3);
    const puzzle = generatePuzzle(solved, 3);
    const heuristics = initializeHeuristics(solved, 3);
    config.heuristics.forEach(heuristic => {
      try {
        computeBench(puzzle, heuristics[heuristic], heuristic);
        logBench(state);
      } catch (e) {
        console.error(e.message);
      }
    });
    await new Promise(r => setTimeout(r, 200));
  }
};

const computeBench = (
  puzzle: Puzzle,
  heuristic: Heuristic,
  type: heuristics
) => {
  const time = Date.now();
  const { numNodes, maxNumNodes, createdNodes } = algorithms.astar({
    puzzle: puzzle,
    heuristic,
    search: 'normal'
  });
  const solveTime = Date.now() - time;
  state[type].allSolvedTimes.push(solveTime);
  state[type].solveTime = solveTime;
  state[type].createdNodes = createdNodes;
  state[type].allCreatedNodes.push(createdNodes);
  state[type].numNodes = numNodes;
  state[type].allNumNodes.push(numNodes);
  state[type].maxNumNodes = maxNumNodes;
  state[type].allMaxNumNodes.push(maxNumNodes);
};
