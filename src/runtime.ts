import * as algorithms from './algo';
import { generateSolvedPuzzle, generatePuzzle } from './generatePuzzle';
import { initializeHeuristics } from './heuristics';
import { logger } from './logger';
import { config } from './config';

const state: State = {
  manhattan: {
    allSolvedTimes: [],
    createdNodes: 0,
    solveTime: 0,
    allCreatedNodes: []
  },
  linearConflict: {
    allSolvedTimes: [],
    createdNodes: 0,
    solveTime: 0,
    allCreatedNodes: []
  },
  inversion: {
    allSolvedTimes: [],
    createdNodes: 0,
    solveTime: 0,
    allCreatedNodes: []
  }
};

export const runOnce = () => {
  const solved = generateSolvedPuzzle(config.size);
  const puzzle = generatePuzzle(solved, config.size);
  const heuristics = initializeHeuristics(solved, config.size);
  try {
    config.heuristics.forEach(heuristic => {
      compute(puzzle, heuristics[heuristic], config.size, heuristic);
    });
    logger(state);
  } catch (e) {
    console.error(e.message);
  }
};

export const run = async () => {
  while (true) {
    const solved = generateSolvedPuzzle(config.size);
    const puzzle = generatePuzzle(solved, config.size);
    const heuristics = initializeHeuristics(solved, config.size);
    config.heuristics.forEach(heuristic => {
      try {
        compute(puzzle, heuristics[heuristic], config.size, heuristic);
        logger(state);
      } catch (e) {
        console.error(e.message);
      }
    });
    await new Promise(r => setTimeout(r, config.timeout));
  }
};

const compute = (
  puzzle: Puzzle,
  heuristic: Heuristic,
  len: number,
  type: 'inversion' | 'linearConflict' | 'manhattan'
) => {
  const time = Date.now();
  config.algorithms.forEach(algorithm => {
    const { node, numNodes, maxNumNodes, createdNodes } = algorithms[algorithm](
      {
        puzzle: puzzle,
        heuristic,
        search: len === 4 ? 'greedy' : 'uniform'
      }
    );
    const solveTime = Date.now() - time;
    state[type].allSolvedTimes.push(solveTime);
    state[type].solveTime = solveTime;
    state[type].createdNodes = createdNodes;
    state[type].allCreatedNodes.push(createdNodes);
  });
};
