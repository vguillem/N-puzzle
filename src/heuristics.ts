type PerNum = { [num: number]: number };

export const initializeHeuristics = (solved: Puzzle, size: number) => {
  const indexesPerNum = solved.flat().reduce<PerNum>(arrayToSet, {});
  return {
    manhattan: manhattan(indexesPerNum, size),
    inversion: inversion(indexesPerNum),
    linearConflict: linearConflict(indexesPerNum, size)
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
  for (let line = 0; line < size; line++) {
    for (let col = 0; col < size; col++) {
      if (puzzle[line][col] === 0) continue;
      const index = solved[puzzle[line][col]];
      x = index % size;
      y = Math.floor(index / size);
      heuristic += Math.abs(x - col) + Math.abs(y - line);
    }
  }
  return heuristic;
};

const inversion = (solved: PerNum) => (puzzle: Puzzle) => {
  const flattened = puzzle.flat();
  return flattened.reduce((acc, currentValue, index) => {
    const fromIndex = solved[currentValue];
    for (let i = index + 1; i < flattened.length; i++) {
      const toIndex = solved[flattened[i]];
      if (toIndex < fromIndex) acc += 1;
    }
    return acc;
  }, 0);
};

const linearConflict = (solved: PerNum, size: number) => (puzzle: Puzzle) => {
  let heuristic = 0,
    x: number,
    y: number,
    nextIndex: number,
    nextX: number,
    nextY: number;
  for (let line = 0; line < size; line++) {
    for (let col = 0; col < size; col++) {
      const index = solved[puzzle[line][col]];
      x = index % size;
      y = Math.floor(index / size);
      for (let nextCol = col + 1; nextCol < size; nextCol++) {
        nextIndex = solved[puzzle[line][nextCol]];
				nextX = nextIndex % size;
				if (nextX < col) heuristic += 1;
      }
      for (let nextLine = line + 1; nextLine < size; nextLine++) {
        nextIndex = solved[puzzle[nextLine][col]];
				nextY = Math.floor(nextIndex / size);
				if (nextY < line) heuristic += 1;
      }
      heuristic += Math.abs(x - col) + Math.abs(y - line);
    }
  }
  return heuristic;
};
