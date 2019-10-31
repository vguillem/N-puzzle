import { solve } from "./algo";
import { generateSolvedPuzzle, generatePuzzle } from "./generatePuzzle";
import { initializeHeuristics } from "./heuristics";

const solved3x3 = generateSolvedPuzzle(3);

const puzzle3x3 = generatePuzzle(3, solved3x3);

const { manhattan } = initializeHeuristics(solved3x3, 3);

try {
	const time = Date.now();
	console.log('puzzle to solve: ', puzzle3x3);
  const solved = solve({ puzzle: puzzle3x3, heuristic: manhattan });
	console.log(solved);
	console.log(`time: ${Date.now() - time}ms`);
} catch (e) {
  console.error(e.message);
}
