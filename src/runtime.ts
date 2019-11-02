import { astar, idastar } from "./algo";
import { generateSolvedPuzzle, generatePuzzle } from "./generatePuzzle";
import { initializeHeuristics } from "./heuristics";
import { logger } from "./logger";

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
  while (true) {
    const solved = generateSolvedPuzzle(len);
    const puzzle = generatePuzzle(len);
    const { manhattan, linearConflict, inversion } = initializeHeuristics(
      solved,
      len
    );
    try {
      compute(puzzle, manhattan, len, "manhattan");
      // compute(puzzle, inversion, len, "inversion");
      compute(puzzle, linearConflict, len, "linearConflict");
      logger(state);
    } catch (e) {
      console.error(e.message);
    }
    await new Promise(r => setTimeout(r, timeout));
  }
};

const compute = (
  puzzle: Puzzle,
  heuristic: Heuristic,
  len: number,
  type: "inversion" | "linearConflict" | "manhattan"
) => {
  const time = Date.now();
/*const { visitedNodes, createdNodes } =*/ idastar({
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
