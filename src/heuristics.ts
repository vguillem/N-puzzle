export const initializeHeuristics = (solved: Puzzle, size: number) => {
  const indexesPerNum = solved.flat().reduce<PerNum>(arrayToSet, {});
  return {
    manhattan: manhattan(indexesPerNum, size),
    hamming: hamming(solved, size),
    linearConflict: linearConflict(indexesPerNum, size),
    cornerTile: cornerTile(indexesPerNum, size),
    combined: combined(indexesPerNum, size)
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

      const sCol = solved[tile] % size;
      const sRow = Math.floor(solved[tile] / size);
      manhattanValue += Math.abs(sCol - col) + Math.abs(sRow - row);

      if (row === sRow) {
        for (let colNext = col + 1; colNext < size; colNext++) {
          const nextTile = puzzle[row][colNext];
          if (!nextTile) continue;

          const nextScol = solved[nextTile] % size;
          const nextSrow = Math.floor(solved[nextTile] / size);

          const onSameRow = nextSrow === row;
          const conflicting = nextScol < sCol;
          if (onSameRow && conflicting)
            conflicts.push([tile, nextTile], [nextTile, tile]);
        }
        while (conflicts.length) {
          const max = getMax(conflicts);
          conflicts = conflicts.filter(d => d[0] !== max && d[1] !== max);
          allConflicts++;
        }
      }

      if (col === sCol) {
        for (let rowNext = row + 1; rowNext < size; rowNext++) {
          const nextTile = puzzle[rowNext][col];
          if (!nextTile) continue;

          const nextScol = solved[nextTile] % size;
          const nextSrow = Math.floor(solved[nextTile] / size);

          const onSameCol = nextScol === col;
          const conflicting = sRow > nextSrow;
          if (onSameCol && conflicting)
            conflicts.push([tile, nextTile], [nextTile, tile]);
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

const combined = (solved: PerNum, size: number) => (puzzle: Puzzle) => {
  let manhattanValue = 0;
  let allConflicts = 0;
  let conflicts: Array<[number, number]> = [];
  const { addCornerConflict, getCornerTileConflict } = cornersTiles(size);

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const tile = puzzle[row][col];
      if (!tile) continue;

      const sCol = solved[tile] % size;
      const sRow = Math.floor(solved[tile] / size);
      const value = Math.abs(sCol - col) + Math.abs(sRow - row);
      addCornerConflict(value, col * size + row);
      manhattanValue += value;

      if (row === sRow) {
        for (let colNext = col + 1; colNext < size; colNext++) {
          const nextTile = puzzle[row][colNext];
          if (!nextTile) continue;

          const nextScol = solved[nextTile] % size;
          const nextSrow = Math.floor(solved[nextTile] / size);

          const onSameRow = nextSrow === row;
          const conflicting = nextScol < sCol;
          if (onSameRow && conflicting)
            conflicts.push([tile, nextTile], [nextTile, tile]);
        }
        while (conflicts.length) {
          const max = getMax(conflicts);
          conflicts = conflicts.filter(d => d[0] !== max && d[1] !== max);
          allConflicts++;
        }
      }

      if (col === sCol) {
        for (let rowNext = row + 1; rowNext < size; rowNext++) {
          const nextTile = puzzle[rowNext][col];
          if (!nextTile) continue;

          const nextScol = solved[nextTile] % size;
          const nextSrow = Math.floor(solved[nextTile] / size);

          const onSameCol = nextScol === col;
          const conflicting = sRow > nextSrow;
          if (onSameCol && conflicting)
            conflicts.push([tile, nextTile], [nextTile, tile]);
        }
        while (conflicts.length) {
          const max = getMax(conflicts);
          conflicts = conflicts.filter(d => d[0] !== max && d[1] !== max);
          allConflicts++;
        }
      }
    }
  }

  return manhattanValue + 2 * allConflicts + getCornerTileConflict();
};

const getMax = (conflicts: Array<[number, number]>) => {
  const conflictsByValue = conflicts.reduce((a, conflict) => {
    if (!a[conflict[0]]) a[conflict[0]] = 1;
    else a[conflict[0]] += 1;
    return a;
  }, {} as { [key: string]: number });
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

export const cornerTile = (solved: PerNum, size: number) => (
  puzzle: Puzzle
) => {
  const { addCornerConflict, getCornerTileConflict } = cornersTiles(size);

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
      const value = Math.abs(solvedCol - col) + Math.abs(solvedRow - row);
      addCornerConflict(value, col * size + row);
      heuristic += value;
    }
  }
  return heuristic + getCornerTileConflict();
};

const cornersTiles = (size: number) => {
  const tiles = [0, 0, 0, 0];

  const addCornerConflict = (value: number, index: number) => {
    if (value) {
      switch (index) {
        case 0:
          tiles[0] += 1;
          break;
        case size - 1:
          tiles[1] += 1;
          break;
        case size * size - size:
          tiles[2] += 1;
          break;
        case size * size - 1:
          tiles[3] += 1;
          break;
        default:
          break;
      }
    } else {
      switch (index) {
        case 1:
        case size:
          tiles[0] += 1;
          break;
        case size - 2:
        case 2 * size - 1:
          tiles[1] += 1;
          break;
        case size * size - 2 * size:
        case size * size - size:
          tiles[2] += 1;
          break;
        case size * size - 2:
        case size * size - (size + 1):
          tiles[3] += 1;
          break;
        default:
          break;
      }
    }
  };

  const getCornerTileConflict = () =>
    tiles.reduce((acc, t) => {
      if (t === 3) acc += 4;
      return acc;
    }, 0);

  return {
    addCornerConflict,
    getCornerTileConflict
  };
};
