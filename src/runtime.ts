import * as algorithms from './algo';
import { generateSolvedPuzzle, generatePuzzle } from './generatePuzzle';
import { initializeHeuristics } from './heuristics';
import { logOnce, logBench, logPuzzle } from './logger';
import { config } from './config';
import { getAllSteps } from './utils';
import { useWorker } from './worker';

const generateEmptyState = () => ({
  solveTime: 0,
  allSolvedTimes: [],
  createdNodes: 0,
  allCreatedNodes: [],
  nbStudiedNodes: 0,
  allNbStudiedNodes: [],
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

export const runOnce = async (puzzle: Puzzle) => {
  const solved = generateSolvedPuzzle(config.size);
  //const heuristics = initializeHeuristics(solved, config.size);
  const promises: any = [];
  const solvedId = solved.flat().join('|');
  // const heuristics = initializeHeuristics(solved, config.size);
  console.log();
  logPuzzle(puzzle, config.size);
  config.algorithms.forEach(algorithm => {
    config.heuristics.forEach(heuristic => {
      config.search.forEach(search => {
        // computeOnce(
        //   puzzle,
        //   heuristics[heuristic],
        //   heuristic,
        //   algorithm,
        //   search,
        //   solvedId
        // );
        // logOnce(algorithm, heuristic, search, state);
        promises.push(
          useWorker({
            solved,
            solvedId,
            puzzle,
            type: heuristic,
            algorithm,
            search,
            size: config.size
          })
        );
      });
    });
  });

  await Promise.all(promises)
    .then(() => {
      console.log('end');
    })
    .catch(err => {
      console.log(err);
    });
};

export const computeOnce = (
  puzzle: Puzzle,
  heuristic: Heuristic,
  type: heuristics,
  algorithm: algorithms,
  search: searchStyle,
  solvedId: string
) => {
  const time = Date.now();
  const {
    node,
    nbStudiedNodes: numNodes,
    maxNumNodes,
    createdNodes
  } = algorithms[algorithm]({
    puzzle: puzzle,
    heuristic,
    search,
    solvedId
  });
  const solveTime = Date.now() - time;
  if (config.showSteps) {
    state[type].steps = getAllSteps(puzzle, node.path);
  }
  state[type].solveTime = solveTime;
  state[type].createdNodes = createdNodes;
  state[type].nbStudiedNodes = numNodes;
  state[type].maxNumNodes = maxNumNodes;
  state[type].path = node.path;
  logOnce(algorithm, type, search, state);
};

export const runBench = async () => {
  while (true) {
    const solved = generateSolvedPuzzle(3);
    const solvedId = solved.flat().join('|');
    const puzzle = generatePuzzle(solved, 3);
    const heuristics = initializeHeuristics(solved, 3);
    config.heuristics.forEach(heuristic => {
      computeBench(puzzle, heuristics[heuristic], heuristic, solvedId);
      logBench(state);
    });
    await new Promise(r => setTimeout(r, 200));
  }
};

const computeBench = (
  puzzle: Puzzle,
  heuristic: Heuristic,
  type: heuristics,
  solvedId: string
) => {
  const time = Date.now();
  const {
    nbStudiedNodes: numNodes,
    maxNumNodes,
    createdNodes
  } = algorithms.astar({
    puzzle: puzzle,
    heuristic,
    search: 'normal',
    solvedId
  });
  const solveTime = Date.now() - time;
  state[type].allSolvedTimes.push(solveTime);
  state[type].solveTime = solveTime;
  state[type].createdNodes = createdNodes;
  state[type].allCreatedNodes.push(createdNodes);
  state[type].nbStudiedNodes = numNodes;
  state[type].allNbStudiedNodes.push(numNodes);
  state[type].maxNumNodes = maxNumNodes;
  state[type].allMaxNumNodes.push(maxNumNodes);
};
