import { solve } from './algo';
import { generateSolvedPuzzle } from "./generatePuzzle";
import { initializeHeuristics } from "./heuristics";
import { puzzle3x3 } from "./data";

const solved3x3 = generateSolvedPuzzle(3);

const { manhattan } = initializeHeuristics(solved3x3, 3);

const puzzleHeuristic = manhattan(puzzle3x3);
const solvedHeuristic = manhattan(solved3x3);

console.log(puzzleHeuristic);
console.log(solvedHeuristic);

solve({ puzzle: puzzle3x3, heuristic: manhattan });

