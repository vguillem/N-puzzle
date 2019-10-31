import { solve } from "./algo";
import { generateSolvedPuzzle, generatePuzzle } from "./generatePuzzle";
import { initializeHeuristics } from "./heuristics";

const allValues: number[] = [];

(async () => {
  while (true) {
    const len = 3;
    const solved = generateSolvedPuzzle(len);
    const puzzle = generatePuzzle(len);
    const { manhattan } = initializeHeuristics(solved, len);
    try {
      const time = Date.now();

      // console.log("puzzle to solve: ", puzzle);
      /* const solved = */ solve({ puzzle: puzzle, heuristic: manhattan });
      // console.log(solved);

      const solveTime = Date.now() - time;
      allValues.push(solveTime);
      console.log(`solved in ${solveTime}ms`);
      logs();
    } catch (e) {
      console.error(e.message);
    }
    await new Promise(r => setTimeout(() => r(), 100));
  }
})();

function logs() {
  console.log("average: ", toMs(getAvg().toFixed(2)));
  console.log("standard deviation: ", toMs(getStandardDeviation().toFixed(4)));
  console.log(
    "min: ",
    toMs(allValues.reduce((a, b) => Math.min(a, b), Infinity).toString())
  );
  console.log(
    "max: ",
    toMs(allValues.reduce((a, b) => Math.max(a, b), -Infinity).toString())
  );
  console.log("\n");
}

function getAvg() {
  return allValues.reduce((a, b) => a + b, 0) / allValues.length;
}

function getStandardDeviation() {
  const average = getAvg();
  const sumOfSquared = allValues.reduce((a, b) => a + (b - average) ** 2, 0);
  return Math.sqrt(sumOfSquared / allValues.length);
}

function toMs(str: string) {
  return `${str}ms`;
}
