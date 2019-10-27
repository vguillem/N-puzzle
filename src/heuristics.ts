type PerNum = { [num: number]: number };

export const initializeHeuristics = (solved: Puzzle, size: number) => {
  const indexesPerNum = solved.flat().reduce<PerNum>(arrayToSet, {});
  return {
    manhattan: manhattan(indexesPerNum, size)
  };
};

const arrayToSet = (acc: PerNum, cur: number, i: number) => {
  acc[cur] = i;
  return acc;
};

const manhattan = (solved: PerNum, size: number) => (puzzle: Puzzle) => {
  let heuristic = 0,
    x: number,
    y: number;
  for (let line = 0; line < puzzle.length; line++) {
    for (let col = 0; col < puzzle.length; col++) {
      const index = solved[puzzle[line][col]];
      x = index % size;
      y = Math.floor(index / size);
      heuristic += Math.abs(x - col) + Math.abs(y - line);
    }
  }
  return heuristic;
};

