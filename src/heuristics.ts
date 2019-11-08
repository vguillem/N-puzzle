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
    solvedRow: number;
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (puzzle[row][col] === 0) continue;
      const index = solved[puzzle[row][col]];
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
  let solvedCol: number,
    solvedRow: number,
    solvedIndex: number,
    nextSolvedIndex: number,
    nextSolvedCol: number,
    nextSolvedRow: number,
    tile: number,
    manhattanValue: number = 0,
    nextTile: number,
    minConflicts: number = 0;

  for (let row = 0; row < size; row++) {
    let conflicts: Array<[number, number]> = [];

    for (let col = 0; col < size; col++) {
      tile = puzzle[row][col];
      if (!tile) continue;

      solvedIndex = solved[tile];
      solvedCol = solvedIndex % size;
      solvedRow = Math.floor(solvedIndex / size);

      manhattanValue += Math.abs(solvedCol - col) + Math.abs(solvedRow - row);

      if (Math.floor(tile / size) === solvedRow) {
        for (let nextCol = col + 1; nextCol < size; nextCol++) {
          nextTile = puzzle[row][nextCol];
          if (!nextTile) continue;

          nextSolvedIndex = solved[nextTile];
          nextSolvedCol = nextSolvedIndex % size;
          nextSolvedRow = Math.floor(nextSolvedIndex / size);

          // if both tile should be in the same row and the next tile is before the current tile
          if (nextSolvedRow === solvedRow && nextSolvedCol < solvedCol) {
            conflicts.push([tile, nextTile], [nextTile, tile]);
          }
        }
      }
    }
    while (conflicts.length) {
      const max = getMax(conflicts);
      conflicts = conflicts.filter(d => d[0] !== max && d[1] !== max);
      minConflicts++;
    }
  }
  for (let col = 0; col < size; col++) {
    let conflicts: Array<[number, number]> = [];

    for (let row = 0; row < size; row++) {
      tile = puzzle[row][col];
      if (!tile) continue;

      solvedIndex = solved[puzzle[row][col]];
      solvedCol = solvedIndex % size;
      solvedRow = Math.floor(solvedIndex / size);

      if (tile % size === solvedCol) {
        for (let nextRow = row + 1; nextRow < size; nextRow++) {
          nextTile = puzzle[nextRow][col];
          if (!nextTile) continue;

          nextSolvedIndex = solved[nextTile];
          nextSolvedCol = nextSolvedIndex % size;
          nextSolvedRow = Math.floor(nextSolvedIndex / size);

          // if both tiles should be on the same column and the next tile is before the current tile
          if (nextSolvedCol === solvedCol && nextSolvedRow < solvedRow) {
            conflicts.push([tile, nextTile], [nextTile, tile]);
          }
        }
      }
    }
    while (conflicts.length) {
      const max = getMax(conflicts);
      conflicts = conflicts.filter(d => d[0] !== max && d[1] !== max);
      minConflicts++;
    }
  }

  return manhattanValue + 2 * minConflicts;
};

const getMax = (conflicts: Array<[number, number]>) => {
  let maxValue = -1;
  let maxConflict = 0;
  const all = conflicts.reduce(
    (a, cur) => {
      if (a[cur[0]]) a[cur[0]].push(cur[1]);
      else a[cur[0]] = [cur[1]];
      return a;
    },
    {} as { [id: number]: number[] }
  );
  for (const key in all) {
    if (all[key].length > maxValue) {
      maxConflict = +key;
      maxValue = all[key].length;
    }
  }
  return maxConflict;
};
