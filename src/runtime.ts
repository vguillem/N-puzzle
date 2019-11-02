import { astar, idastar } from "./algo";
import { generateSolvedPuzzle, generatePuzzle } from "./generatePuzzle";
import { initializeHeuristics } from "./heuristics";
import { logger } from "./logger";

const puzzle = [
   [ 0, 14, 5, 1 ],
   [ 10, 8, 15, 12 ],
   [ 11, 9, 6, 13 ],
   [ 4, 7, 2, 3 ]
];

const state: State = {
  manhattan: {
    allSolvedTimes: [],
    visitedNodes: 0,
    createdNodes: 0,
    solveTime: 0,
    allVisitedNodes: [],
    allCreatedNodes: []
  },
  linearConflict: {
    allSolvedTimes: [],
    visitedNodes: 0,
    createdNodes: 0,
    solveTime: 0,
    allVisitedNodes: [],
    allCreatedNodes: []
  },
  inversion: {
    allSolvedTimes: [],
    visitedNodes: 0,
    createdNodes: 0,
    solveTime: 0,
    allVisitedNodes: [],
    allCreatedNodes: []
  }
};

export const run = async (len: number, timeout: number) => {
	if (timeout) {}
    const solved = generateSolvedPuzzle(len);
    const { manhattan, linearConflict} = initializeHeuristics(
      solved,
      len
    );
    try {
      compute(puzzle, linearConflict, len, "linearConflict");
      logger(state);
    } catch (e) {
      console.error(e.message);
    }

  // while (true) {
    // const solved = generateSolvedPuzzle(len);
    // const puzzle = generatePuzzle(
    //   solved.flat().reduce((a, b, i) => {
    //     a[b] = i;
    //     return a;
    //   }, {}),
    //   len
    // );
    // const { manhattan, linearConflict, inversion } = initializeHeuristics(
    //   solved,
    //   len
    // );
    // try {
    //   // compute(puzzle, manhattan, len, "manhattan");
    //   // compute(puzzle, inversion, len, "inversion");
    //   compute(puzzle, linearConflict, len, "linearConflict");
    //   logger(state);
    // } catch (e) {
    //   console.error(e.message);
    // }
    // await new Promise(r => setTimeout(r, timeout));
  // }
};

const compute = (
  puzzle: Puzzle,
  heuristic: Heuristic,
  len: number,
  type: "inversion" | "linearConflict" | "manhattan"
) => {
  const time = Date.now();
/* const { visitedNodes, createdNodes } = */ idastar({
    puzzle: puzzle,
    heuristic,
    search: len === 4 ? "greedy" : "shortest"
  });
  const solveTime = Date.now() - time;
  state[type].allSolvedTimes.push(solveTime);
  state[type].solveTime = solveTime;
  // state[type].createdNodes = createdNodes;
  // state[type].allCreatedNodes.push(createdNodes);
  // state[type].visitedNodes = visitedNodes;
  // state[type].allVisitedNodes.push(visitedNodes);
};
