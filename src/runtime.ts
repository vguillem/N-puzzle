import * as algorithms from './algo';
import { generateSolvedPuzzle, generatePuzzle } from './generatePuzzle';
import { initializeHeuristics } from './heuristics';
import { logOnce, logBench, logPuzzle } from './logger';
import { config } from './config';
import { getAllSteps } from './utils';
import { useWorker } from './worker';
import { computeOnce } from './compute';

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

export const runOnce = (puzzle: Puzzle) => {
  const solved = generateSolvedPuzzle(config.size);

  console.log();
  logPuzzle(puzzle, config.size);

  const promises: Array<Promise<AlgorithmData>> = [];
  const values: AlgorithmData[] = [];

  config.algorithms.forEach(algorithm => {
    config.heuristics.forEach(heuristic => {
      config.search.forEach(search => {
        if (config.enableWorkers) {
          promises.push(
            useWorker({
              type: heuristic,
              size: config.size,
              solved,
              puzzle,
              algorithm,
              search
            })
          );
        } else {
          updateAndLog(puzzle)(
            computeOnce({
              solved,
              puzzle,
              type: heuristic,
              algorithm,
              search,
              size: config.size
            })
          );
        }
      });
    });
  });

  if (config.enableWorkers) {
    Promise.all(promises)
      .then(res => res.forEach(updateAndLog(puzzle)))
      .catch(e => {
        console.log(e);
      });
  }
};

const updateAndLog = (puzzle: Puzzle) => (value: AlgorithmData) => {
  const {
    solveTime,
    createdNodes,
    numNodes,
    maxNumNodes,
    node,
    algorithm,
    heuristic,
    search
  } = value;
  if (config.showSteps) state[heuristic].steps = getAllSteps(puzzle, node.path);
  state[heuristic].solveTime = solveTime;
  state[heuristic].createdNodes = createdNodes;
  state[heuristic].nbStudiedNodes = numNodes;
  state[heuristic].maxNumNodes = maxNumNodes;
  state[heuristic].path = node.path;
  logOnce(algorithm, heuristic, search, state);
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
  const { nbStudiedNodes: numNodes, maxNumNodes, createdNodes } = algorithms[
    config.algorithms[0]
  ]({
    puzzle: puzzle,
    heuristic,
    search: 'normal',
    solvedId,
    size: config.size
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
