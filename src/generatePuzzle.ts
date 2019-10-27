const isSolvable = (grid: Puzzle, length: number): boolean => {
  const gridValues = grid.flat();

  const inversion = getInversion(gridValues);

  if (length % 2) return Boolean(inversion % 2);

  const startPos = Math.floor(gridValues.indexOf(0) / length) + 1;
  return inversion % 2 === startPos % 2;
};

const getInversion = (gridValues: number[]) =>
  gridValues.reduce((acc, num, index) => {
    for (let i = index + 1; i < gridValues.length - 1; i++) {
      if (gridValues[i] < num) acc += 1;
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

export const generatePuzzle = (size: number) => {
  let puzzle;
  do {
    puzzle = createPuzzle(size);
  } while (!isSolvable(puzzle, size));
  return puzzle;
};
