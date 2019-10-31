export const generatePuzzle = (size: number, solved: Puzzle) => {
  let puzzle;
  do {
    puzzle = createPuzzle(size);
  } while (!isSolvable(puzzle, solved));
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

export const isSolvable = (grid: Puzzle, solved: Puzzle): boolean => {
	const gridValues = grid.flat().filter(d => d !== 0);
	const solvedValues = solved.flat().filter(d => d !== 0);

	const inversion = getInversion(gridValues, solvedValues);

	return gridValues.length % 2 ? inversion % 2 === 0 : inversion % 2 !== 0;
};

const getInversion = (gridValues: number[], solvedValues: number[]) =>
  gridValues.reduce((inversion, currentValue, index) => {
    for (let i = index + 1; i < gridValues.length - 1; i++) {
			// if the expected position of the next value is before the current value
			const nextValue = gridValues[i];
      if (solvedValues.indexOf(nextValue) < solvedValues.indexOf(currentValue)) inversion += 1;
    }
    return inversion;
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
