import { Solver } from './Solver';
import { generatePuzzle } from './generatePuzzle';
// import { puzzle } from './data';

// const args = process.argv;
// if (!args[0]) {
  // console.error('Usage: yarn dev $SIZE');
// }

// generatePuzzle(args[0]);
const puzzle = generatePuzzle(3);
new Solver(puzzle).solve();

