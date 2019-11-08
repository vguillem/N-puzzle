export const initializeHeuristics = (solved: Puzzle, size: number) => {
  const indexesPerNum = solved.flat().reduce<PerNum>(arrayToSet, {});
  return {
    manhattan: manhattan(indexesPerNum, size),
    hamming: hamming(solved, size),
    linearConflict: linearConflict(indexesPerNum, size)
  };
};

const arrayToSet = (acc: PerNum, cur: number, i: number) => {
  acc[cur] = i;
  return acc;
};

const manhattan = (solved: PerNum, size: number) => (puzzle: Puzzle) => {
  let heuristic = 0,
    solvedCol: number,
    solvedRow: number,
    index: number;
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (puzzle[row][col] === 0) continue;
      index = solved[puzzle[row][col]];
      solvedCol = index % size;
      solvedRow = Math.floor(index / size);
      heuristic += Math.abs(solvedCol - col) + Math.abs(solvedRow - row);
    }
  }
  return heuristic;
};

const hamming = (solved: Puzzle, size: number) => (puzzle: Puzzle) => {
  let heuristic = 0;
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (puzzle[row][col] === 0) continue;
      if (puzzle[row][col] !== solved[row][col]) heuristic++;
    }
  }
  return heuristic;
};

const linearConflict = (solved: PerNum, size: number) => (puzzle: Puzzle) => {
  let manhattanValue = 0;
  let allConflicts = 0;
  let conflicts: Array<[number, number]> = [];

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const tile = puzzle[row][col];
      if (!tile) continue;

      const sCol = solved[tile] % 3;
      const sRow = Math.floor(solved[tile] / 3);
      manhattanValue += Math.abs(sCol - col) + Math.abs(sRow - row);

      if (row === sRow) {
        for (let colNext = 0; colNext < size; colNext++) {
          const nextTile = puzzle[row][colNext];
          if (nextTile === tile || !nextTile) continue;

          const nextScol = solved[nextTile] % 3;
          const nextSrow = Math.floor(solved[nextTile] / 3);

          const onSameRow = nextSrow === row;
          const conflicting = col < colNext ? nextScol < sCol : sCol < nextScol;
          if (onSameRow && conflicting) conflicts.push([tile, nextTile]);
        }
        while (conflicts.length) {
          const max = getMax(conflicts);
          conflicts = conflicts.filter(d => d[0] !== max && d[1] !== max);
          allConflicts++;
        }
      }

      if (col === sCol) {
        for (let rowNext = 0; rowNext < size; rowNext++) {
          const nextTile = puzzle[rowNext][col];
          if (nextTile === tile || !nextTile) continue;

          const nextScol = solved[nextTile] % 3;
          const nextSrow = Math.floor(solved[nextTile] / 3);

          const onSameCol = nextScol === col;
          const conflicting = row < rowNext ? nextSrow < sRow : sRow < nextSrow;
          if (onSameCol && conflicting) conflicts.push([tile, nextTile]);
        }
        while (conflicts.length) {
          const max = getMax(conflicts);
          conflicts = conflicts.filter(d => d[0] !== max && d[1] !== max);
					allConflicts++;
        }
      }
    }
  }

  return manhattanValue + 2 * allConflicts;
};

const getMax = (conflicts: Array<[number, number]>) => {
  const conflictsByValue = conflicts.reduce(
    (a, conflict) => {
      if (!a[conflict[0]]) a[conflict[0]] = 1;
      else a[conflict[0]] += 1;
      return a;
    },
    {} as { [key: string]: number }
  );
  let maxConflicts = 0;
  let tile = 0;
  for (const key in conflictsByValue) {
    if (conflictsByValue[key] > maxConflicts) {
      maxConflicts = conflictsByValue[key];
      tile = +key;
    }
  }
  return tile;
};
