import fs from 'fs';
import {
  generateSolvedPuzzle,
  generatePuzzle,
  isSolvable
} from './generatePuzzle';
import { config } from './config';

export function getPuzzle(args: string[]) {
  let inputString;
  try {
    inputString = findFile(args);
  } catch {
    throw new Error('file');
  }

  if (!inputString) {
    const solvedPuzzle = generateSolvedPuzzle(config.size);
    return generatePuzzle(solvedPuzzle, config.size);
  }

  let puzzle: Puzzle;
  try {
    puzzle = parse(inputString);
  } catch {
    throw new Error('file');
  }

  const solvedPuzzle = generateSolvedPuzzle(config.size);
  const perNum = solvedPuzzle.flat().reduce((a, b, i) => {
    a[b] = i;
    return a;
  }, {});

  if (!isSolvable(perNum, puzzle, config.size)) throw new Error('unsolvable');
  return puzzle;
}

function findFile(args: string[]) {
  if (fs.existsSync(args[args.length - 1]))
    return fs.readFileSync(args[args.length - 1]).toString();
  else return null;
}

function parse(file: string) {
  const data = file
    .split('\n')
    .map(d => d.replace(/#.*$/, ''))
    .filter(d => d.length);

  const size = Number(data[0]);
  const firstLineRemoved = data.slice(1);
  if (isNaN(size) || size < 3 || size > 6 || size !== firstLineRemoved.length)
    throw null;
  config.size = size;

  let puzzle: Puzzle = [[]];
  const currentValues = new Set<number>();
  for (let i = 0; i < config.size; i++) {
    const nums = firstLineRemoved[i]
      .split(' ')
      .filter(d => d.length)
      .map(Number);

    if (nums.length !== size) throw null;
    nums.forEach(d => {
      if (isNaN(d) || currentValues.has(d)) throw null;
      currentValues.add(d);
    });

    puzzle[i] = nums;
  }

  return puzzle;
}
