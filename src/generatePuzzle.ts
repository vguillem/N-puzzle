export const generatePuzzle = (size: number) => {
  let puzzle;
  do {
    puzzle = createPuzzle(size);
  } while (!isSolvable(puzzle, size));
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

export const isSolvable = (grid: Puzzle, length: number) => {
  const gridValues = grid.flat();
  const inversion = getInversion(gridValues);
  // solvable if grid length and inversion are both odd
  // even with 0 at end goal
  if (length % 2 === 1) return inversion % 2 === 1;
  // solvable if grid length is even and
  // inversion is even and 0 line is even
  // or inversion is odd and 0 line is odd
  const zeroPosition = Math.floor(gridValues.indexOf(0) / length) + 1;
  return inversion % 2 === zeroPosition % 2;
};

const getInversion = (gridValues: number[]) =>
  gridValues.reduce((acc, currentValue, index) => {
    for (let i = index + 1; i < gridValues.length; i++) {
      const nextValue = gridValues[i];
      if (nextValue && nextValue < currentValue) acc += 1;
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
