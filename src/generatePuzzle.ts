const isSolvable = (grid: number[][], length: number): boolean => {
  const list = grid.flat();

  const inversion = list.reduce((acc, e, index) => {
    for (let i = index + 1; i < list.length; i++) {
      if (list[i] && e > list[i]) acc += 1;
    }
    return acc;
  }, 0);
  console.log("inversion", inversion);

  // solvable if grid length is odd and inversion is odd  // even with 0 a end goal
  if (length % 2 === 1) return inversion % 2 === 1;

  // solvable if grid length is even and
  // inversion is even and 0 line is even
  // or inversion is odd and 0 line is odd
  const zeroPosition = Math.floor(list.indexOf(0) / length) + 1;
  console.log("zpos : ", zeroPosition);
  return inversion % 2 === zeroPosition % 2;
};

const createPuzzle = (size: number): number[][] => {
  // sets are faster than arrays for checking values
  const all: Set<number> = new Set();
  const maxValue = size * size;
  const result: number[][] = new Array(size)
    .fill(-1)
    .map(_ => new Array(size).fill(-1));

  for (let i = 0; i < size; i++) {
    result[i] = [];
    for (let j = 0; j < size; j++) {
      let r = getRandom(maxValue);
      while (all.has(r)) r = getRandom(maxValue);
      result[i][j] = r;
      all.add(r);
    }
  }
  console.log(result);
  return result;
};

const getRandom = (max: number): number =>
  Math.floor(Math.random() * Math.floor(max));

export const generatePuzzle = (size: number) => {
  let puzzle;
  do {
    puzzle = createPuzzle(size);
  } while (!isSolvable(puzzle, size));
  return puzzle;
};
