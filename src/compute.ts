import * as algorithms from './algo';
import { initializeHeuristics } from './heuristics';

interface Params {
  solved: Puzzle;
  puzzle: Puzzle;
  type: heuristics;
  algorithm: algorithms;
  search: searchStyle;
  size: number;
}

export const computeOnce = (params: Params) => {
  const { puzzle, solved, type, algorithm, search, size } = params;
  const solvedId = solved.flat().join('|');
  const heuristics = initializeHeuristics(solved, size);
  const heuristic = heuristics[type];
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
    solvedId,
    size
  });
  const solveTime = Date.now() - time;
  return {
    ...params,
    heuristic: type,
    solveTime,
    node,
    numNodes,
    maxNumNodes,
    createdNodes
  };
};
