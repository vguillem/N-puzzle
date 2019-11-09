export const generatePuzzle = (solved: Puzzle, size: number) => {
  let flatSolved = solved.flat().reduce(
    (a, b, i) => {
      a[b] = i;
      return a;
    },
    {} as { [id: number]: number }
  );
  let puzzle;
  do {
    puzzle = createPuzzle(size);
  } while (!isSolvable(flatSolved, puzzle, size));
  return puzzle;
};

export const generateSolvedPuzzle = (size: number) => {
  const puzzle = new Array(size)
    .fill(null)
    .map(_ => new Array(size).fill(null));

  let [i, j] = [0, 0];
  let [iInc, jInc] = [0, 1];
  for (let x = 0; x < size * size; x++) {
    puzzle[i][j] = x + 1 === size * size ? 0 : x + 1;
    if ((i + 1 === size || puzzle[i + iInc][j] !== null) && iInc !== 0) {
      iInc = 0;
      jInc = j - 1 > 0 && puzzle[i][j - 1] === null ? -1 : 1;
    } else if ((j + 1 === size || puzzle[i][j + jInc] !== null) && jInc !== 0) {
      jInc = 0;
      iInc = i - 1 > 0 && puzzle[i - 1][j] === null ? -1 : 1;
    }
    i += iInc;
    j += jInc;
  }
  return puzzle;
};

export const isSolvable = (solved: PerNum, grid: Puzzle, length: number) => {
  const gridValues = grid.flat();
  const inversion = getInversion(solved, gridValues.filter(d => d !== 0));
  // solvable if grid length and inversion are both odd
  // even with 0 at end goal
  if (length % 2 === 1) return inversion % 2 === 0;

	// if the line of 0 and the inversion have the same parity, then the puzzle is solvable
	// on an even puzzle size
  const zeroPosition = Math.floor(gridValues.indexOf(0) / length);
  return inversion % 2 === zeroPosition % 2;
};

const getInversion = (solved: PerNum, gridValues: number[]) =>
  gridValues.reduce((acc, currentValue, index) => {
    const fromIndex = solved[currentValue];
    for (let i = index + 1; i < gridValues.length; i++) {
      const toIndex = solved[gridValues[i]];
      if (toIndex < fromIndex) acc += 1;
    }
    return acc;
  }, 0);

const createPuzzle = (size: number): Puzzle => {
  const currentValues: Set<number> = new Set();
  const maxValue = size * size;
  return new Array(size).fill(null).map(_ =>
    new Array(size).fill(null).map(_ => {
      const value = generateValue(currentValues, maxValue);
      currentValues.add(value);
      return value;
    })
  );
};

const generateValue = (currentValues: Set<number>, max: number): number => {
  let value = getRandom(max);
  while (currentValues.has(value)) value = getRandom(max);
  return value;
};

const getRandom = (max: number) => Math.floor(Math.random() * Math.floor(max));
