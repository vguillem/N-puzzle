import { solve } from "./algo";
import { generateSolvedPuzzle, generatePuzzle } from "./generatePuzzle";
import { initializeHeuristics } from "./heuristics";

const allValuesManhattan: number[] = [];
const allValuesLinear: number[] = [];
const allValuesInversion: number[] = [];

(async () => {
  while (true) {
    const len: number = 3;
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

      console.clear();

      console.log("-------- linearConflict ----------");
      console.log(`solved in ${solveTimeC}ms`);
      logs("linearConflict");

      console.log("-------- inversion ----------");
      console.log(`solved in ${solveTimeA}ms`);
      logs("inversion");

      console.log("-------- manhattan ----------");
      console.log(`solved in ${solveTimeB}ms`);
      logs("manhattan");

    } catch (e) {
      console.error(e.message);
    }
    await new Promise(r => setTimeout(() => r(), 100));
  }
})();

function logs(type: "manhattan" | "inversion" | "linearConflict") {
  let allValues: number[];
  switch (type) {
    case "manhattan":
      allValues = allValuesManhattan;
      break;
    case "inversion":
      allValues = allValuesInversion;
      break;
    case "linearConflict":
      allValues = allValuesLinear;
      break;
    default:
      allValues = [];
  }
  console.log("average: ", toMs(getAvg(allValues).toFixed(2)));
  console.log(
    "standard deviation: ",
    toMs(getStandardDeviation(allValues).toFixed(4))
  );
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

function getAvg(allValues: number[]) {
  return allValues.reduce((a, b) => a + b, 0) / allValues.length;
}

function getStandardDeviation(allValues: number[]) {
  const average = getAvg(allValues);
  const sumOfSquared = allValues.reduce((a, b) => a + (b - average) ** 2, 0);
  return Math.sqrt(sumOfSquared / allValues.length);
}

function toMs(str: string) {
  return `${str}ms`;
}
