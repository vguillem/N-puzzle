import { solve } from "./algo";
import { generateSolvedPuzzle, generatePuzzle } from "./generatePuzzle";
import { initializeHeuristics } from "./heuristics";
import { logs } from "./logger";

const allValuesManhattan: number[] = [];
const allValuesLinear: number[] = [];
const allValuesInversion: number[] = [];

export const run = async (len: number, timeout: number) => {
  while (true) {
    const solved = generateSolvedPuzzle(len);
    const puzzle = generatePuzzle(len);
    const { manhattan, linearConflict, inversion } = initializeHeuristics(
      solved,
      len
    );
    try {
      let [timeA, timeB, timeC] = [0, 0, 0];
      let [solveTimeA, solveTimeB, solveTimeC] = [0, 0, 0];

      timeA = Date.now();
      solve({
        puzzle: puzzle,
        heuristic: inversion,
        search: len === 4 ? "greedy" : "shortest"
      });
      solveTimeA = Date.now() - timeA;
      allValuesInversion.push(solveTimeA);

      timeB = Date.now();
      solve({
        puzzle: puzzle,
        heuristic: manhattan,
        search: len === 4 ? "greedy" : "shortest"
      });
      solveTimeB = Date.now() - timeB;
      allValuesManhattan.push(solveTimeB);

      timeC = Date.now();
      solve({
        puzzle: puzzle,
        heuristic: linearConflict,
        search: len === 4 ? "greedy" : "shortest"
      });
      solveTimeC = Date.now() - timeC;
      allValuesLinear.push(solveTimeC);
			print(solveTimeA, solveTimeB, solveTimeC);
    } catch (e) {
      console.error(e.message);
    }
    await new Promise(r => setTimeout(() => r(), timeout));
  }
};

function print(solveTimeA: number, solveTimeB: number, solveTimeC: number) {
  console.clear();

  console.log("\x1b[32;1m-------- linearConflict --------\x1b[0m");
  console.log();
	console.log(`\x1b[36;1msolved in            \x1b[32m${solveTimeC}\x1b[0;32mms\x1b[0m`);
  logs(allValuesLinear);

  console.log("\x1b[32;1m-------- inversion --------\x1b[0m");
  console.log();
	console.log(`\x1b[36;1msolved in            \x1b[32m${solveTimeA}\x1b[0;32mms\x1b[0m`);
  logs(allValuesInversion);

  console.log("\x1b[32;1m-------- manhattan --------\x1b[0m");
  console.log();
	console.log(`\x1b[36;1msolved in            \x1b[32m${solveTimeB}\x1b[0;32mms\x1b[0m`);
  logs(allValuesManhattan);
}
